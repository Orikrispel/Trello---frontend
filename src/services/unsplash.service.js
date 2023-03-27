import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import axios from 'axios'

const API = 'TNd4Z9ubrPbnItRTUVp8LuWDZHK2gYNEXR9koj3EvIk'
const UNSPLASH_KEY = 'unsplashDB'

export const unsplashService = {
    getImgs,
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

}

