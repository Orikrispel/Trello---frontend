import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

export const unsplashService = {
    getImg,
}

function getImg() {
    return 'http://unsplash.it/50/50'
}


