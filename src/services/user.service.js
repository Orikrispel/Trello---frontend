// import { storageService } from './async-storage.service'
import { httpService } from './http.service'
import { utilService } from './util.service'
import { store } from '../store/store'
import {
  socketService,
  SOCKET_EVENT_USER_UPDATED,
  SOCKET_EMIT_USER_WATCH,
} from './socket.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,
  update,
  getRandomDefaultMember,
  getDefaultMembers,
  getRandomUsers,
  // changeScore,
}

window.userService = userService

function getUsers() {
  // return storageService.query('user')
  return httpService.get(`user`)
}

function onUserUpdate(user) {}

async function getById(userId) {
  // const user = await storageService.get('user', userId)
  const user = await httpService.get(`user/${userId}`)

  socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
  socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
  socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

  return user
}
function remove(userId) {
  // return storageService.remove('user', userId)
  return httpService.delete(`user/${userId}`)
}

async function update(user) {
  // const user = await storageService.get('user', _id)

  // await storageService.put('user', user)

  user = await httpService.put(`user/${user._id}`, user)
  console.log('userService', user)
  // Handle case in which admin updates other user's details
  if (getLoggedinUser()._id === user._id) saveLocalUser(user)
  return user
}

async function login(userCred) {
  const user = await httpService.post('auth/login', userCred)
  if (user) {
    socketService.login(user._id)
    return saveLocalUser(user)
  }
}
async function signup(userCred) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
  // const user = await storageService.post('user', userCred)
  const user = await httpService.post('auth/signup', userCred)
  // socketService.login(user._id)
  return saveLocalUser(user)
}
async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
  socketService.logout()
  return await httpService.post('auth/logout')
}

// async function changeScore(by) {
//   const user = getLoggedinUser()
//   if (!user) throw new Error('Not loggedin')
//   user.score = user.score + by || by
//   await update(user)
//   return user.score
// }

function saveLocalUser(user) {
  user = {
    _id: user._id,
    fullname: user.fullname,
    imgUrl: user.imgUrl,
    boards: user.boards,
    tasks: user.tasks,
    // score: user.score,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
  return user
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getRandomDefaultMember() {
  return getDefaultMembers()[utilService.getRandomIntInclusive(0, 2)]
}

async function getRandomUsers(amount = 5) {
  let users = await getUsers()
  let res = []
  for (let i = 0; i < amount; i++) {
    res.push(users[utilService.getRandomIntInclusive(0, users.length - 1)])
  }
}

function getDefaultMembers() {
  return [
    {
      _id: '64251c27a476517cf20661ef',
      fullname: 'Yohai Korem',
      imgUrl: '../assets/imgs/memberImgs/memberImgYohai.jpg',
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
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'puki', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()
