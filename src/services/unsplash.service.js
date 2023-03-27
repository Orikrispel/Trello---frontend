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


async function getImgs(query = 'israel', count = 4) {
    const URL = `http://api.unsplash.com/search/photos?query=${query}&client_id=${API}&per_page=${count}`
    try {
        const savedImgs = utilService.loadFromStorage(UNSPLASH_KEY)
        if (savedImgs) {
            return savedImgs
        }
        const imgs = await axios.get(URL)
        const imgUrls = imgs.data.results.map(img => img.urls)
        utilService.saveToStorage(UNSPLASH_KEY, imgUrls)
        return imgUrls
    }
    catch {
        console.log('error')
    }
}



function getRandomImg() {
    const imgs = [
        'https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwzfHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
        'https://images.unsplash.com/photo-1528164344705-47542687000d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHw0fHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
        'https://images.unsplash.com/photo-1480796927426-f609979314bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=Mnw0MjYwNzZ8MHwxfHNlYXJjaHwyfHxqYXBhbnxlbnwwfHx8fDE2Nzk5MjU5MjU&ixlib=rb-4.0.3&q=80&w=200',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        ''
    ]
    return imgs[utilService.getRandomIntInclusive(0, imgs.length - 1)]
}

