import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import axios from 'axios'

const API = 'TNd4Z9ubrPbnItRTUVp8LuWDZHK2gYNEXR9koj3EvIk'
const UNSPLASH_KEY = 'unsplashDB'

export const unsplashService = {
    getImgs,
    getRandomImg,
}


async function getImgs(query = 'israel', count = 4, isSearch = false) {
    const URL = `http://api.unsplash.com/search/photos?query=${query}&client_id=${API}&per_page=${count}`
    try {
        const savedImgs = utilService.loadFromStorage(UNSPLASH_KEY)
        if (savedImgs && !isSearch) {
            return savedImgs
        }
        const imgs = await axios.get(URL)
        console.log('imgs', imgs)
        const imgUrls = imgs.data.results.map(img => img.urls)
        return imgUrls
    }
    catch {
        console.log('error')
    }
}



function getRandomImg() {
    const imgs = [
        {
            thumb: 'https://images.unsplash.com/photo-1528164344705-47542687000d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHw0fHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
            raw: "https://images.unsplash.com/photo-1528164344705-47542687000d?ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHw0fHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3",
        },
        {
            thumb: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
            raw: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3',

        },
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
        {},
    ]
    return imgs[utilService.getRandomIntInclusive(0, imgs.length - 1)]
}

