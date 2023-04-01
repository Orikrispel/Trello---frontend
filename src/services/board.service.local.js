import { storageService } from './async-storage.service.js'
import { colorItems, utilService } from './util.service.js'
import { userService } from './user.service.js'
import { unsplashService } from './unsplash.service.js'
// import { fchown } from 'fs'
const BOARD_STORAGE_KEY = 'board'
export const boardService = {
  query,
  getById,
  save,
  remove,
  getEmptyBoard,
  getEmptyGroup,
  getEmptyTask,
  addBoardMsg,
  getDefaultEmptyLabels,
  getDefaultEmptyLabel,
  getDefaultMembers,
  getEmptyComment,
  colorItems,
  getDemoData,
}
window.cs = boardService

async function query(filterBy = { txt: '', price: 0 }) {
  let boards = await storageService.query(BOARD_STORAGE_KEY)
  if (!boards || !boards.length) boards = _createBoards()
  // if (filterBy.txt) {
  //   const regex = new RegExp(filterBy.txt, 'i')
  //   boards = boards.filter(
  //     (board) => regex.test(board.vendor) || regex.test(board.description)
  //   )
  // }
  return boards
}

function getById(boardId) {
  return storageService.get(BOARD_STORAGE_KEY, boardId)
}

async function remove(boardId) {
  await storageService.remove(BOARD_STORAGE_KEY, boardId)
}

async function save(board, key = BOARD_STORAGE_KEY) {
  var savedBoard
  if (board._id) {
    savedBoard = await storageService.put(key, board)
  } else {
    // Later, owner is set by the backend
    // board.owner = userService.getLoggedinUser()
    savedBoard = await storageService.post(key, board)
  }
  return savedBoard
}

async function addBoardMsg(boardId, txt) {
  // Later, this is all done by the backend
  const board = await getById(boardId)
  if (!board.msgs) board.msgs = []

  const msg = {
    id: utilService.makeId(),
    by: userService.getLoggedinUser(),
    txt,
  }
  board.msgs.push(msg)
  await storageService.put(BOARD_STORAGE_KEY, board)

  return msg
}

function getEmptyBoard(
  title = '',
  isStarred = false,
  createdBy = {},
  style = { imgUrls: { raw: '', thumb: '', regular: '', }, backgroundColor: '' },
  groups = [getEmptyGroup()]
) {
  return {
    _id: '',
    title,
    isStarred,
    style,
    labels: getDefaultEmptyLabels(),
    createdBy,
    groups,
  }
}

// GROUPS:
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

function getRandomTask(
  title = utilService.getRandomTaskTitles(),
  description = utilService.getRandomTaskDesc(),
  labels = getRandomLabels(),
) {
  let res = getEmptyTask(
    title,
    description,
    [labels],
    [getDefaultMembers()[utilService.getRandomIntInclusive(0, 2)]]
  )
  return res
}

function getRandomLabels(amount = 4) {
  let labels = []
  for (let i = 0; i < amount; i++) {
    labels.push(getRandomLabel(i))
  }
  return labels
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomLabel(idx = utilService.getRandomIntInclusive()) {
  return {
    id: utilService.makeId(),
    title: utilService.getRandomLabelTitle(),
    color: colorItems[idx],
  }
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
  return colorItems[getRandomIntInclusive(0, 6)]
}

function getDefaultEmptyLabel() {
  return {
    id: '',
    title: ' ',
    color: '#d6ecd2',
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

function getDefaultMembers() {
  return [
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
  members.splice(0, getRandomIntInclusive(0, 2))
  return members
}



async function _createBoards(amount = 15) {
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
    currTask.labels = getRandomLabels(getRandomIntInclusive(0, 5))
    currTask.cover = getRandomCover()
    let currChecklist = (i % 2 === 0) ? _getRandomChecklist(false) : _getRandomChecklist(true)
    currTask.checklists.push(currChecklist)
    currTask.members = (i % 3 === 0) ? getRandomMembers() : []
    group.tasks.push(currTask)
  }
  return group
}

function _getDemoFile() {
  return {
    id: 'att' + utilService.makeId(),
    url: "data:image/png;base64,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",
    name: 'CSS code',
    createdAt: 'Added on' + utilService.formatDateString(Date.now())
  }
}

function getRandomCover() {
  return { color: getRandomCoverColor(), type: getRandomCoverType() }
}

function getRandomCoverColor() {
  const colorItems = [
    '#7bc86c',
    '#f5dd29',
    '#ffaf3f',
    '#cd8de5',
    '#5ba4c1',
  ]
  return colorItems[getRandomIntInclusive(0, 4)]
}

function getRandomCoverType() {
  const types = ['', 'semi', 'semi', 'full', '', '']
  return types[getRandomIntInclusive(0, 5)]
}

async function getDemoData() {
  let board = getEmptyBoard("Project Managment", false, userService.getRandomDefaultMember(),
    { imgUrls: '', backgroundColor: 'linear-gradient(32deg, rgba(206,185,70,0.9), rgba(204,43,250,0.9))' }, _getRandomGroups(6))
  board.labels = getRandomLabels(8)

  board = await save(board)
  return board
}

function _getRandomChecklist(isDone = true) {
  const checklist = {
    id: 'cl' + utilService.makeId(5),
    title: 'Checklist',
    todos: [
      {
        id: 'td' + utilService.makeId(5),
        title: "Finish UI",
        isDone,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: "Finish UX",
        isDone,
      },
      {
        id: 'td' + utilService.makeId(5),
        title: "Finish filters",
        isDone,
      }
    ]
  }
  return checklist
}


function randomStarBoard() {
  const num = getRandomIntInclusive(1, 4)
  if (num === 4) return true
  return false
}

function getEmptyComment() {
  return {
    id: '',
    txt: '',
    createdAt: null,
    byMember: null,
  }
}

function _setRandomImgs(board) {
  board.style.backgroundColor = ''
  board.style.imgUrls = unsplashService.getRandomImg()
}

async function _createBoard(
  title = 'Robot dev proj',
  labels = getRandomLabels(8)
) {
  let board = {
    _id: '',
    title,
    isStarred: randomStarBoard(),
    archivedAt: 1589983468418,
    createdBy: {
      _id: 'u101',
      fullname: 'Yohai Korem',
      imgUrl: 'http://some-img',
    },
    style: {
      backgroundColor: _getBoardRandomGradient(),
      imgUrls: [], //unsplashService.getRandomImg(this.backgroundColor),
    },
    labels,
    members: getDefaultMembers(),
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
                byMember: {
                  _id: 'u101',
                  fullname: 'Yohai Korem',
                  imgUrl:
                    'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                },
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
            memberIds: ['u101'],
            labelIds: ['l101', 'l102'],
            dueDate: 16156215211,
            byMember: {
              _id: 'u101',
              username: 'yoyo',
              fullname: 'Yohai Korem',
              imgUrl:
                'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
            },
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
        byMember: {
          _id: 'u101',
          fullname: 'Yohai Korem',
          imgUrl: 'http://some-img',
        },
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

function getDemoGroups() {
  getEmptyGroup('Backlog Server', null)
  getEmptyGroup('Backlog Client', null)
  getEmptyGroup('In Dev', null)
  getEmptyGroup('QA', null)
  getEmptyGroup('DONE', null)
  getEmptyGroup('Ready for Production', null)
}

const demoBoardWorkFlow = {
  _id: '',
  title: 'Workflow',
  isStarred: true,
  archivedAt: null,
  createdBy: {
    _id: '64251c27a476517cf20661ef',
    fullname: 'yohai korem',
    imgUrl: null,
  },
  style: {},
}

export const demoBoards = [
  {
    _id: '',
    title: 'Robot dev proj',
    isStarred: false,
    archivedAt: 1589983468418,
    createdBy: {
      _id: 'u101',
      fullname: 'Abi Abambi',
      imgUrl: 'http://some-img',
    },
    style: {},
    labels: getDefaultEmptyLabels(),
    // [
    // {
    //   id: 'l101',
    //   title: 'Done',
    //   color: '#61bd4f',
    // },
    // {
    //   id: 'l102',
    //   title: 'Progress',
    //   color: '#faf3c0',
    // },
    // ],
    members: [
      {
        _id: 'u101',
        fullname: 'Yohai Korem',
        imgUrl: 'https://www.google.com',
      },
    ],
    groups: [
      {
        id: 'g101',
        title: 'Group 1',
        type: 'container',
        props: {
          orientation: 'vertical',
        },
        archivedAt: 1589983468418,
        tasks: [
          {
            id: 'c101',
            title: 'Replace logo',
            type: 'draggable',
            loading: false,
            cover: {},
          },
          {
            id: 'c102',
            title: 'Add Samples',
            type: 'draggable',
            loading: false,
            cover: {},
          },
        ],
        style: {},
      },
      {
        id: 'g102',
        title: 'Group 2',
        type: 'container',
        props: {
          orientation: 'vertical',
        },
        tasks: [
          {
            id: 'c103',
            title: 'Do that',
            archivedAt: 1589983468418,
            type: 'draggable',
            loading: false,
            cover: {},
            labels: [
              { id: '', txt: 'urgent', bgc: '' },
              { txt: 'backend', bgc: '' },
            ],
          },
          {
            id: 'c104',
            title: 'Help me',
            status: 'in-progress', // monday
            priority: 'high',
            description: 'description',
            type: 'draggable',
            loading: false,
            comments: [
              {
                id: 'ZdPnm',
                txt: 'also @yaronb please CR this',
                createdAt: 1590999817436,
                byMember: {
                  _id: 'u101',
                  fullname: 'Yohai Korem',
                  imgUrl:
                    'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                },
              },
            ],
            checklists: [
              {
                id: 'YEhmF',
                title: 'Checklist',
                todos: [
                  {
                    id: '212jX',
                    title: 'To Do 1',
                    isDone: false,
                  },
                ],
              },
            ],
            memberIds: ['u101'],
            labelIds: ['l101', 'l102'],
            dueDate: 16156215211,
            byMember: {
              _id: 'u101',
              username: 'Tal',
              fullname: 'Yohai Korem',
              imgUrl:
                'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
            },
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
        byMember: {
          _id: 'u101',
          fullname: 'Abi Abambi',
          imgUrl: 'http://some-img',
        },
        task: {
          id: 'c101',
          title: 'Replace Logo',
        },
      },
    ],

    cmpsOrder: ['status-picker', 'member-picker', 'date-picker'],
  },
  {
    _id: '',
    title: 'Sprint 4 - Tasks',
    isStarred: false,
    archivedAt: 1589983468418,
    createdBy: {
      _id: 'u102',
      fullname: 'Amit Cohen',
      imgUrl: '',
    },
    style: {},
    labels: getDefaultEmptyLabels(),
    members: [
      {
        _id: 'u101',
        fullname: 'Idan Amedi',
        imgUrl: '',
      },
    ],
    groups: [
      {
        id: 'g1011',
        title: 'Group 1',
        type: 'container',
        props: {
          orientation: 'vertical',
        },
        archivedAt: 1589983468418,
        tasks: [
          {
            id: 'c1011',
            title: 'End QA',
            type: 'draggable',
            loading: false,
            cover: {},
          },
          {
            id: 'c1021',
            title: 'Start Backend',
            type: 'draggable',
            loading: false,
            cover: {},
          },
        ],
        style: {},
      },
      {
        id: 'g1025',
        title: 'Group 2',
        type: 'container',
        props: {
          orientation: 'vertical',
        },
        tasks: [
          {
            id: 'c1031',
            title: 'Do that',
            archivedAt: 1589983468418,
            type: 'draggable',
            loading: false,
            cover: {},
            labels: [
              { id: '', txt: 'urgent', bgc: '' },
              { txt: 'backend', bgc: '' },
            ],
          },
          {
            id: 'c1041',
            title: 'Finish Checklists',
            status: 'in-progress', // monday
            priority: 'high',
            description: 'description',
            type: 'draggable',
            loading: false,
            comments: [
              {
                id: 'ZdPnmvvv',
                txt: 'let yaron biton to cr this horrible code',
                createdAt: 1590999817436,
                byMember: {
                  _id: 'u101',
                  fullname: 'Yohai Korem',
                  imgUrl:
                    'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
                },
              },
            ],
            checklists: [
              {
                id: 'YEhmF',
                title: 'Checklist',
                todos: [
                  {
                    id: '212jXddd',
                    title: 'To Do 1',
                    isDone: false,
                  },
                ],
              },
            ],
            memberIds: ['u1012'],
            labelIds: ['l1012', 'l1022'],
            dueDate: 16156215211,
            byMember: {
              _id: 'u1011',
              username: 'Tal',
              fullname: 'Ori Teicher',
              imgUrl:
                'http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg',
            },
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
        id: 'a10111',
        txt: 'Changed Color',
        createdAt: 154514,
        byMember: {
          _id: 'u101ddd',
          fullname: 'Abi Abambi',
          imgUrl: 'http://some-img',
        },
        task: {
          id: 'c1011sss',
          title: 'Replace Logo',
        },
      },
    ],

    cmpsOrder: ['status-picker', 'member-picker', 'date-picker'],
  },
]

// TEST DATA
// ;(async ()=>{
//     await storageService.post(BOARD_STORAGE_KEY, {vendor: 'Subali Karov 1', price: 180})
//     await storageService.post(BOARD_STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 240})
// })()
