// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService, colorItems } from './util.service.js'
import { userService } from './user.service.js'
import { unsplashService } from './unsplash.service.js'
import { store } from '../store/store'
import {
  getActionRemoveBoard,
  getActionUpdateBoard,
  getActionStarBoard,
} from '../store/board.store'
import {
  socketService,
  SOCKET_EVENT_BOARD_UPDATED,
  SOCKET_EMIT_BOARD_UPDATED,
} from './socket.service'
const STORAGE_KEY = 'board'
const BASE_URL = 'board/'
export const boardService = {
  query,
  getById,
  save,
  remove,
  getEmptyBoard,
  addBoardMsg,
  getEmptyGroup,
  getEmptyTask,
  getDefaultEmptyLabels,
  getDefaultEmptyLabel,
  getEmptyActivity,
  getEmptyComment,
  colorItems,
}
window.cs = boardService

async function query() {
  let user = userService.getLoggedinUser()
  // let userId = user._id
  let boards = await httpService.get(BASE_URL)
  if (!boards || !boards.length) boards = _createBoards()
  return boards
}
function getById(boardId) {
  // return storageService.get(STORAGE_KEY, boardId)
  return httpService.get(`board/${boardId}`)
}

async function remove(boardId) {
  // await storageService.remove(STORAGE_KEY, boardId)
  return httpService.delete(`board/${boardId}`)
}
async function save(board) {
  var savedBoard
  if (board._id) {
    // savedBoard = await storageService.put(STORAGE_KEY, board)
    savedBoard = await httpService.put(`board/${board._id}`, board)
  } else {
    // Later, owner is set by the backend
    // board.owner = userService.getLoggedinUser()
    // savedBoard = await storageService.post(STORAGE_KEY, board)
    savedBoard = await httpService.post('board', board)
  }
  socketService.emit(SOCKET_EMIT_BOARD_UPDATED, savedBoard)

  return savedBoard
}

async function addBoardMsg(boardId, txt) {
  const savedMsg = await httpService.post(`board/${boardId}/msg`, { txt })
  return savedMsg
}

function getEmptyBoard(
  title = '',
  isStarred = false,

  createdBy = {},
  style = {},
  groups = [getEmptyGroup()],
  members = []
) {
  return {
    title,
    isStarred,
    style,
    labels: getDefaultEmptyLabels(),
    createdBy,
    groups,
    members,
  }
}

function getEmptyGroup(title = '', archivedAt = null, tasks = [], style = {}) {
  return {
    id: utilService.makeId(),
    title,
    type: 'container',
    props: {
      orientation: 'vertical',
      className: 'card-container',
    },
    archivedAt,
    tasks,
    style,
  }
}

function getEmptyTask(
  title = '',
  description = '',
  labels = [],
  members = [],
  cover = {},
  files = [],
  checklists = [],
  comments = [],
  activities = []
) {
  return {
    id: utilService.makeId(),
    title,
    cover,
    type: 'draggable',
    props: {
      className: 'card',
    },
    description,
    labels,
    files,
    checklists,
    members,
    comments,
    activities,
  }
}

function getDefaultEmptyLabels() {
  return [
    {
      id: utilService.makeId(),
      title: '',
      color: '#d6ecd2',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#faf3c0',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#fce6c6',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#f5d3ce',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#eddbf4',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#bcd9ea',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#bdecf3',
    },
    {
      id: utilService.makeId(),
      title: '',
      color: '#dfe1e6',
    },
  ]
}

function getDefaultEmptyLabel() {
  return {
    id: '',
    title: ' ',
    color: '#d6ecd2',
  }
}
function _getRandomGroups(count = 4) {
  const groups = []
  for (let i = 0; i < count; i++) {
    let currGroup = _getRandomGroup(utilService.getRandomIntInclusive(2, 5))
    currGroup.tasks[0].cover = { type: 'semi', color: '' }
    currGroup.tasks[0].files.push(getFile(i))
    if (i === 0) {
      currGroup.title = 'In Development'
      currGroup.tasks[0].title = 'Finish all HTML work for the app homepage'
      currGroup.tasks[0].checklists.push(_getDemoChecklist())
      currGroup.tasks[0].labels = []
      currGroup.tasks[0].cover = { type: 'semi', color: 'orange' }
    }
    if (i === 1) currGroup.title = 'Backlog-Server'
    if (i === 2) currGroup.title = 'Done'
    if (i === 3) currGroup.title = 'QA'
    if (i === 4) currGroup.title = 'Ready for production'
    groups.push(currGroup)
  }
  return groups
}

function _getDemoChecklist() {
  const checklist = {
    id: 'cl' + utilService.makeId(5),
    title: 'Checklist',
    todos: [
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish basic design',
        isDone: true,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish board components',
        isDone: true,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish group components',
        isDone: true,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish home filters.',
        isDone: false,
      },
    ],

  }
  return checklist
}

function _getRandomGroup(count = 5) {
  const group = getEmptyGroup()
  for (let i = 0; i < count; i++) {
    let currTask = getRandomTask()
    if (i % 2 === 0) {
      currTask.cover = getRandomCover()
      currTask.labels = getRandomLabels(utilService.getRandomIntInclusive(1, 3))
    }
    let currChecklist =
      i % 4 === 0 ? _getRandomChecklist(true) : _getRandomChecklist(false)
    currTask.checklists.push(currChecklist)
    currTask.members = i % 3 === 0 ? getRandomMembers() : []
    group.tasks.push(currTask)
  }
  return group
}

function getFile(num) {
  const files = [
    {
      name: 'Code screenshot',
      url: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680441162/Screenshot_20221216_133859_re0ltt.png',
      createdAt: 'Added on ' + utilService.formatDateString(Date.now()),
    },
    {
      name: 'Coding-gif',
      url: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680442558/coding_gif_ml4plo.gif',
      createdAt: 'Added on' + utilService.formatDateString(Date.now()),
    },
    {
      name: 'Mongo-DB',
      url: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680444655/mongo-db_yq2uoz.png',
      createdAt: 'Added on' + utilService.formatDateString(Date.now()),
    },
    {
      name: 'Work-Gif',
      url: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680442771/work_gif_ow8ysf.gif',
      createdAt: 'Added on' + utilService.formatDateString(Date.now()),
    },
    {
      name: 'Github-Gif',
      url: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680449935/github-logo-300x300_uaexvj.png',
      createdAt: 'Added on' + utilService.formatDateString(Date.now()),
    },
    {
      name: 'Vue-Logo',
      url: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680450260/vuee_logo_o4xi6t.png',
      createdAt: 'Added on' + utilService.formatDateString(Date.now()),
    },
  ]
  return files[num]
}

function getRandomMembers() {
  let members = [
    {
      _id: '64251c27a476517cf20661ef',
      fullname: 'Yohai Korem',
      imgUrl: '',
    },
    {
      _id: '64253e39a476517cf20661f0',
      fullname: 'Ori Krispel',
      imgUrl: '',
    },
    {
      _id: '64259a5c5e24b789998fc9a6',
      fullname: 'Ori Teicher',
      imgUrl: '',
    },
  ]
  members.splice(0, utilService.getRandomIntInclusive(0, 2))
  return members
}

function _getRandomChecklist(isDone = true) {
  const checklist = {
    id: 'cl' + utilService.makeId(5),
    title: 'Checklist',
    todos: [
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish UI',
        isDone,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish UX',
        isDone,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: 'Finish filters',
        isDone,
      },
    ],
  }
  return checklist
}

function getRandomCover() {
  return { color: getRandomCoverColor(), type: 'semi' }
}
function getRandomTask(
  title = utilService.getRandomTaskTitles(),
  description = utilService.getRandomTaskDesc(),
  labels = getRandomLabels()
) {
  let res = getEmptyTask(
    title,
    description,
    [labels],
    [userService.getDefaultMembers()[utilService.getRandomIntInclusive(0, 2)]]
  )
  return res
}

function getRandomCoverColor() {
  const colorItems = ['#7bc86c', '#f5dd29', '#ffaf3f', '#cd8de5', '#5ba4c1']
  return colorItems[utilService.getRandomIntInclusive(0, 4)]
}

function getRandomCoverType() {
  const types = ['semi', 'semi', 'full']
  return types[utilService.getRandomIntInclusive(0, 2)]
}

function _getBoardRandomGradient() {
  const colorItems = [
    'linear-gradient(55.41deg, rgb(12, 102, 228) 2%, rgb(55, 180, 195) 100%)',
    'linear-gradient(55.41deg, rgb(12, 102, 228) 2%, rgb(9, 50, 108) 100%)',
    'linear-gradient(55.41deg, rgb(9, 50, 108) 2%, rgb(205, 81, 157) 100%)',
    'linear-gradient(55.41deg, rgb(110, 93, 198) 2%, rgb(231, 116, 187) 100%)',
    'linear-gradient(55.41deg, rgb(227, 73, 53) 2%, rgb(250, 165, 61) 100%)',
    'linear-gradient(55.41deg, rgb(250, 165, 61) 2%, rgb(89, 201, 2) 100%)',
  ]
  return colorItems[utilService.getRandomIntInclusive(0, 6)]
}

function _getBoardRandomColor() {
  const colorItems = [
    '#fad29c',
    '#efb3ab',
    '#5ba4cf',
    '#f5dd29',
    '#5aac44',
    'gray',
  ]
  return colorItems[utilService.getRandomIntInclusive(0, 5)]
}

function getRandomLabel(
  idx = utilService.getRandomIntInclusive(0, colorItems.length - 1)
) {
  return {
    id: utilService.makeId(),
    title: utilService.getRandomLabelTitle(),
    color: colorItems[idx],
  }
}

function getRandomLabels(amount = 4) {
  let labels = []
  for (let i = 0; i < amount; i++) {
    labels.push(getRandomLabel(i))
  }
  return labels
}

async function _createBoards(amount = 20) {
  let boards = []
  for (let i = 0; i < amount; i++) {
    boards.push(await _createBoard(utilService.getRandomProjectNames(i)))
  }
  let demoBoard = await getDemoData()
  boards.unshift(demoBoard)
  return boards
}

function getGroupsWithFiles(demoBoard) {
  let newBoard = JSON.parse(JSON.stringify(demoBoard))
  for (let i = 0; i < 4; i++) {
    newBoard.groups[i].tasks[0].cover.type = 'semi'
    newBoard.groups[i].tasks[0].files.push(getFile(i))
  }
  return newBoard
}

async function getDemoData() {
  let board = getEmptyBoard(
    'Project Managment',
    false,
    userService.getRandomDefaultMember(),
    {
      imgUrls: '',
      backgroundColor:
        'linear-gradient(55.41deg, rgb(227, 73, 53) 2%, rgb(250, 165, 61) 100%)',
    },
    _getRandomGroups(6),
    userService.getDefaultMembers()
  )
  board.labels = getRandomLabels(8)
  board = await save(board)
  console.log('hi from demo data', board)
  return board
}

function randomStarBoard() {
  const num = utilService.getRandomIntInclusive(1, 4)
  if (num === 4) return true
  return false
}

function getEmptyComment() {
  return {
    id: utilService.makeId(),
    txt: '',
    createdAt: Date.now(),
    byMember: null,
  }
}

function getEmptyActivity() {
  return {
    id: utilService.makeId(),
    txt: '',
    createdAt: Date.now(),
    byMember: userService.getLoggedinUser(),
    task: null,
  }
}

function _setRandomImgs(board) {
  if (board) {
    board.style.backgroundColor = ''
    board.style.imgUrls = unsplashService.getRandomImg()
  }
}

async function _createBoard(
  title = 'Robot dev proj',
  labels = getRandomLabels(8)
) {
  let board = {
    title,
    isStarred: randomStarBoard(),
    archivedAt: 1589983468418,
    createdBy: await userService.getUsers()[
      utilService.getRandomIntInclusive(0, 2)
    ],
    style: {
      backgroundColor: _getBoardRandomColor(),
      imgUrls: {},
      gradient: _getBoardRandomGradient(),
    },
    labels,
    members: userService.getDefaultMembers(),
    groups: [
      {
        id: utilService.makeId(),
        title: 'Group 1',
        type: 'container',
        props: {
          orientation: 'vertical',
          className: 'card-container',
        },
        archivedAt: 1589983468418,
        tasks: [
          getRandomTask(
            undefined,
            utilService.getRandomTaskDesc(),
            labels[utilService.getRandomIntInclusive(0, labels.length)]
          ),
          getRandomTask(
            undefined,
            utilService.getRandomTaskDesc(),
            labels[utilService.getRandomIntInclusive(0, labels.length)]
          ),
        ],
        style: {},
      },
      {
        id: utilService.makeId(),
        title: 'Group 2',
        type: 'container',
        props: {
          orientation: 'vertical',
          className: 'card-container',
        },
        tasks: [
          getRandomTask(
            undefined,
            utilService.getRandomTaskDesc(),
            labels[utilService.getRandomIntInclusive(0, labels.length)]
          ),
          {
            id: utilService.makeId(),
            title: 'Help me',
            status: 'in-progress', // monday
            priority: 'high',
            description: 'description',
            type: 'draggable',
            props: {
              className: 'card',
            },
            loading: false,
            comments: [
              {
                id: 'ZdPnm',
                txt: 'also @yaronb please CR this',
                createdAt: 1590999817436,
                byMember: await userService.getUsers()[
                  utilService.getRandomIntInclusive(0, 2)
                ],
              },
            ],
            checklists: [
              {
                id: utilService.makeId(),
                title: 'Checklist',
                todos: [
                  {
                    id: utilService.makeId(),
                    title: 'To Do 1',
                    isDone: false,
                  },
                ],
              },
            ],
            memberIds: [userService.getRandomDefaultMember()._id],
            labelIds: [getRandomLabel().id, getRandomLabel().id],
            dueDate: 16156215211,
            byMember:
              userService.getUsers()[utilService.getRandomIntInclusive(0, 2)],
            style: {
              bgColor: '#26de81',
            },
          },
        ],
        style: {},
      },
    ],
    activities: [
      {
        id: 'a101',
        txt: 'Changed Color',
        createdAt: 154514,
        byMember:
          userService.getUsers()[utilService.getRandomIntInclusive(0, 2)],
        task: {
          id: 'c101',
          title: 'Replace Logo',
        },
      },
    ],
    cmpsOrder: ['status-picker', 'member-picker', 'date-picker'],
  }
  board = await save(board)
  return board
}
