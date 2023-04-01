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
  let userId = user._id
  let boards = await httpService.get(BASE_URL)
  if (!boards || !boards.length) boards = _createBoards(7)
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
  groups = [getEmptyGroup()]
) {
  return {
    title,
    isStarred,
    style,
    labels: getDefaultEmptyLabels(),
    createdBy,
    groups,
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
    let currGroup = _getRandomGroup(utilService.getRandomIntInclusive(2, 6))
    currGroup.title = utilService.getRandomLabelTitle()
    if (i === 0) currGroup.title = 'In Development'
    if (i === 1) currGroup.title = 'Backlog-Server'
    if (i === 2) currGroup.title = 'Done'
    if (i === 3) currGroup.title = 'QA'
    if (i === 4) currGroup.title = 'Ready for production'
    groups.push(currGroup)
  }
  return groups
}

function _getRandomGroup(count = 5) {
  const group = getEmptyGroup()
  for (let i = 0; i < count; i++) {
    let currTask = getRandomTask()
    currTask.labels = getRandomLabels(utilService.getRandomIntInclusive(0, 5))
    currTask.cover = getRandomCover()
    let currChecklist =
      i % 2 === 0 ? _getRandomChecklist(false) : _getRandomChecklist(true)
    currTask.checklists.push(currChecklist)
    currTask.members = i % 3 === 0 ? getRandomMembers() : []
    group.tasks.push(currTask)
  }
  return group
}

function getRandomMembers() {
  let members = [
    {
      _id: 'u101',
      fullname: 'Yohai Korem',
      imgUrl: '',
    },
    {
      _id: 'u102',
      fullname: 'Ori Krispel',
      imgUrl: '',
    },
    {
      _id: 'u103',
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
  return { color: getRandomCoverColor(), type: getRandomCoverType() }
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
  const types = ['', 'semi', 'semi', 'full', '', '']
  return types[utilService.getRandomIntInclusive(0, 5)]
}

function _getBoardRandomGradient() {
  const colorItems = [
    'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
    'linear-gradient(to right,#824de4,#080c3e)',
    'linear-gradient(143deg, #a2bc12, #53b8e1)',
    'linear-gradient(331deg, #ad8739, #e35493)',
    'linear-gradient(230deg, #859d0d, #87d9ab)',
    'linear-gradient(187deg, #b36738, #d51d90)',
    'linear-gradient(124deg, #919781, #c67733)',
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
  _setRandomImgs(boards[5])
  _setRandomImgs(boards[9])
  _setRandomImgs(boards[12])
  let demoBoard = await getDemoData()
  boards.unshift(demoBoard)
  return boards
}

async function getDemoData() {
  let board = getEmptyBoard(
    'Project Managment',
    false,
    userService.getRandomDefaultMember(),
    {
      imgUrls: '',
      backgroundColor:
        'linear-gradient(32deg, rgba(206,185,70,0.9), rgba(204,43,250,0.9))',
    },
    _getRandomGroups(6)
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
    createdBy:
      userService.getDefaultMembers()[utilService.getRandomIntInclusive(0, 2)],
    style: {
      backgroundColor: _getBoardRandomColor(),
      imgUrls: unsplashService.getRandomImg(),
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
                byMember: userService.getRandomDefaultMember(),
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
            memberIds: [userService.getRandomDefaultMember().id],
            labelIds: [getRandomLabel().id, getRandomLabel().id],
            dueDate: 16156215211,
            byMember: userService.getRandomDefaultMember(),
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
        byMember: userService.getRandomDefaultMember(),
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
