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
  if (!boards || !boards.length) boards = _createBoards(15)
  console.log('boards', boards)
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
      imgUrl: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680516350/memberImgYohai_xfmijp.jpg',
    },
    {
      _id: 'u102',
      fullname: 'Ori Krispel',
      imgUrl: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680516340/memberImgOriKrispel_uuyfeo.jpg',
    },
    {
      _id: 'u103',
      fullname: 'Ori Teicher',
      imgUrl: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680516345/memberImgOriTeicher_te0vcj.jpg',
    },
  ]
}

function getRandomMembers() {
  let members = [
    {
      _id: 'u101',
      fullname: 'Yohai Korem',
      imgUrl: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680516350/memberImgYohai_xfmijp.jpg',
    },
    {
      _id: 'u102',
      fullname: 'Ori Krispel',
      imgUrl: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680516340/memberImgOriKrispel_uuyfeo.jpg',
    },
    {
      _id: 'u103',
      fullname: 'Ori Teicher',
      imgUrl: 'https://res.cloudinary.com/dcg0ivasg/image/upload/v1680516345/memberImgOriTeicher_te0vcj.jpg',
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
  // _setRandomImgs(boards[5])
  // _setRandomImgs(boards[9])
  // _setRandomImgs(boards[12])
  let demoBoard = await getDemoData()
  console.log('demoBoard', demoBoard)
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
    if (i % 3 === 0) {
      currTask.labels = getRandomLabels(getRandomIntInclusive(0, 2))
    }
    currTask.cover = getRandomCover()
    let currChecklist = (i % 4 === 0) ? _getRandomChecklist(false) : _getRandomChecklist(true)
    currTask.checklists.push(currChecklist)
    currTask.members = (i % 3 === 0) ? getRandomMembers() : []
    group.tasks.push(currTask)
  }
  return group
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
