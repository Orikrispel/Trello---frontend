import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'
import axios from 'axios'

const API = 'TNd4Z9ubrPbnItRTUVp8LuWDZHK2gYNEXR9koj3EvIk'

export const unsplashService = {
    getImg,
}


async function getImgs(query = '', count = 1) {
    const URL = `http://api.unsplash.com/search/photos?query=${query}&client_id=${API}&per_page=${count}`
    try {
        const imgs = await axios.get(URL)
        const boardImgs = imgs.data
    }
    catch {
        console.log('error')
    }
}

function getRandomImg() {

}

