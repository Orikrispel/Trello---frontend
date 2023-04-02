import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import axios from 'axios'
// const axios = Axios.create({
//   withCredentials: true,
// })
const API = 'TNd4Z9ubrPbnItRTUVp8LuWDZHK2gYNEXR9koj3EvIk'
const UNSPLASH_KEY = 'unsplashDB'

export const unsplashService = {
  getImgs,
  getRandomImg,
}

async function getImgs(query = 'israel', count = 4, isSearch = false) {
  const URL = `https://api.unsplash.com/search/photos?query=${query}&client_id=${API}&per_page=${count}`
  try {
    const savedImgs = utilService.loadFromStorage(UNSPLASH_KEY)
    if (savedImgs && !isSearch) {
      return savedImgs
    }
    const imgs = await axios.get(URL)
    const imgUrls = imgs.data.results.map((img) => img.urls)
    return imgUrls
  } catch {
    console.log('error')
  }
}

function getRandomImg() {
  const imgs = [
    {
      regular: '"https://images.unsplash.com/photo-1547483029-77784da27709?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxpc3JhZWx8ZW58MHx8fHwxNjgwMzQyNjc5&ixlib=rb-4.0.3&q=80&w=1080"',
      thumb:
        'https://images.unsplash.com/photo-1528164344705-47542687000d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHw0fHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
      raw: 'https://images.unsplash.com/photo-1528164344705-47542687000d?ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHw0fHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3',
    },
    {
      regular: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHw0fHxqYXBhbnxlbnwwfHx8fDE2ODAyNzc4OTk&ixlib=rb-4.0.3&q=80&w=1080"',
      thumb:
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
      raw: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3',
    },
    {
      regular: '"https://images.unsplash.com/photo-1492571350019-22de08371fd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwxfHxqYXBhbnxlbnwwfHx8fDE2ODAyNzc4OTk&ixlib=rb-4.0.3&q=80&w=1080"',
      thumb: '"https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2ODAxOTE0MjE&ixlib=rb-4.0.3"',
      raw: '"https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2ODAxOTE0MjE&ixlib=rb-4.0.3"'
    }
  ]
  return imgs[utilService.getRandomIntInclusive(0, imgs.length - 1)]
}
