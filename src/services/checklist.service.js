
// import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

export const checklistService = {
    getEmptyChecklist,
    getEmptyTodos,
    getEmptyTodo,
}

function getEmptyChecklist() {
    return {
        id: '',
        title: 'title',
        todos: [],
    }
}

function getEmptyTodos() {
    const todos = [
        getEmptyTodo()
    ]
    return todos
}

function getEmptyTodo() {
    return {
        id: '',
        title: '',
        isDone: false,
    }
}


