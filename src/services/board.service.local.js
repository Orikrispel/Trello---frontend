import { storageService } from './async-storage.service.js'
import { colorItems, utilService } from './util.service.js'
import { userService } from './user.service.js'
import { unsplashService } from './unsplash.service.js'
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
  colorItems,
}
window.cs = boardService

async function query(filterBy = { txt: '', price: 0 }) {
  let boards = await storageService.query(BOARD_STORAGE_KEY)
  if (!boards || !boards.length) boards = _createBoards()
  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    boards = boards.filter(
      (board) => regex.test(board.vendor) || regex.test(board.description)
    )
  }
  if (filterBy.price) {
    boards = boards.filter((board) => board.price <= filterBy.price)
  }
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
  labels = [],
  createdBy = {},
  style = {},
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

function getEmptyTask(title = '', description = '', labels = [], members = [], cover = null, files = []) {
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
    members,
  }
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
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomLabel(idx = utilService.getRandomIntInclusive()) {
  return {
    id: utilService.makeId(),
    title: utilService.getRandomLabelTitle(),
    color: colorItems[idx],
  }
}

function _getBoardRandomColor() {
  const colorItems =
    [
      '#fad29c',
      '#efb3ab',
      '#5ba4cf',
      '#f5dd29',
      '#5aac44',
      'gray',
    ]
  return colorItems[getRandomIntInclusive(0, 5)]
}

function _getBoardRandomGradient() {
  const colorItems =
    ['linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)',
      'linear-gradient(to right,#824de4,#080c3e)',
      'linear-gradient(143deg, #a2bc12, #53b8e1)',
      'linear-gradient(331deg, #ad8739, #e35493)',
      'linear-gradient(230deg, #859d0d, #87d9ab)',
      'linear-gradient(187deg, #b36738, #d51d90)',
      'linear-gradient(124deg, #919781, #c67733)',
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

async function _createBoards(amount = 20) {
  let boards = []
  for (let i = 0; i < amount; i++) {
    boards.push(await _createBoard(utilService.getRandomProjectNames(i)))
  }

  return boards
}

function randomStarBoard() {
  const num = getRandomIntInclusive(1, 4)
  if (num === 4) return true
  return false
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
      backgroundColor: _getBoardRandomColor(),
      imgUrls: unsplashService.getRandomImg(),
      gradient: _getBoardRandomGradient(),
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
