// import { boardService } from '../services/board.service.local'
import { boardService, demoBoard } from '../services/board.service.local'

export function getActionRemoveBoard(boardId) {
  return {
    type: 'removeBoard',
    boardId,
  }
}
export function getActionAddBoard(board) {
  return {
    type: 'addBoard',
    board,
  }
}
export function getActionStarBoard(board) {
  return {
    type: 'starBoard',
    board,
  }
}
export function getActionUpdateBoard(board) {
  return {
    type: 'updateBoard',
    board,
  }
}
export function getActionAddBoardMsg(boardId) {
  return {
    type: 'addBoardMsg',
    boardId,
    txt: 'Stam txt',
  }
}
// TASKS
export function getActionRemoveTask(taskId) {
  return {
    type: 'removeTask',
    taskId,
  }
}
export function getActionAddTask(task) {
  return {
    type: 'addTask',
    task,
  }
}
export function getActionUpdateTask(task) {
  return {
    type: 'updateTask',
    task,
  }
}

export const boardStore = {
  state: {
    boards: [],
    groups: [],
    currBoard: null,
    currGroup: null,
    currTask: null,
    currLabel: null,
  },
  getters: {
    boards({ boards }) {
      return boards
    },
    currBoard({ currBoard }) {
      return currBoard
    },
    currLabels({ currBoard }) {
      return currBoard.labels
    },
    currLabel({ currLabel }) {
      return currLabel
    },
    defaultEmptyLabels() {
      return boardService.getDefaultEmptyLabels()
    },
    defaultEmptyLabel() {
      return boardService.getDefaultEmptyLabel()
    },
    demoBoard() {
      return demoBoard
    },
    currTask({ currTask }) {
      return currTask
    },
    groups({ groups }) {
      return groups
    },
    emptyBoard() {
      return boardService.getEmptyBoard()
    },
    emptyGroup() {
      return boardService.getEmptyGroup()
    },
    emptyTask() {
      return boardService.getEmptyTask()
    },
  },
  mutations: {
    // BOARDS

    setBoards(state, { boards }) {
      state.boards = boards
    },
    addBoard(state, { board }) {
      state.boards.push(board)
    },
    updateBoard(state, { board }) {
      const idx = state.boards.findIndex((b) => b._id === board._id)
      state.boards.splice(idx, 1, board)
    },
    starBoard(state, { board }) {
      const idx = state.boards.findIndex((b) => b._id === board._id)
      state.boards[idx].isStarred = !state.boards[idx].isStarred
    },
    removeBoard(state, { boardId }) {
      state.boards = state.boards.filter((board) => board._id !== boardId)
    },
    setCurrBoard(state, { board }) {
      state.currBoard = board
    },
    setCurrTask(state, { task }) {
      state.currTask = task
    },
    setCurrLabel(state, { label }) {
      state.currLabel = label
    },
  },
  actions: {
    async addBoard(context, { board }) {
      try {
        board = await boardService.save(board)
        context.commit(getActionAddBoard(board))
        return board
      } catch (err) {
        console.log('boardStore: Error in addBoard', err)
        throw err
      }
    },
    async updateBoard(context, { board }) {
      try {
        board = await boardService.save(board)
        context.commit(getActionUpdateBoard(board))
        return board
      } catch (err) {
        console.log('boardStore: Error in updateBoard', err)
        throw err
      }
    },
    async loadBoards(context) {
      try {
        const boards = await boardService.query()
        context.commit({ type: 'setBoards', boards })
      } catch (err) {
        console.log('boardStore: Error in loadBoards', err)
        throw err
      }
    },
    async removeBoard(context, { boardId }) {
      try {
        await boardService.remove(boardId)
        context.commit(getActionRemoveBoard(boardId))
      } catch (err) {
        console.log('boardStore: Error in removeBoard', err)
        throw err
      }
    },
    async addBoardMsg(context, { boardId, txt }) {
      try {
        const msg = await boardService.addBoardMsg(boardId, txt)
        context.commit({ type: 'addBoardMsg', boardId, msg })
      } catch (err) {
        console.log('boardStore: Error in addBoardMsg', err)
        throw err
      }
    },
    async starBoard(context, { board }) {
      try {
        context.commit(getActionStarBoard(board))
        board = await boardService.save(board)
        return board
      } catch (err) {
        console.log('boardStore: Error in starBoard', err)
        throw err
      }
    },

    async loadCurrBoard(context, { boardId }) {
      try {
        const board = await boardService.getById(boardId)
        context.commit({ type: 'setCurrBoard', board })
        return board
      } catch (err) {
        console.log('boardStore: Error in finding current board', err)
        throw err
      }
    },

    //TASKS
    async saveTask({ commit }, { task }) {
      try {
        let savedTask = await boardService.save(task)
        commit(getActionAddTask(savedTask))
      } catch (err) {
        console.log('could not save task at the moment')
      }
    },
    async setCurrTask({ state, commit }, { taskId }) {
      let board = state.currBoard
      let groups = board.groups
      let currTask
      groups.forEach((group) => {
        let { tasks } = group
        currTask = tasks.find((task) => task.id === taskId)
      })
      commit({ type: 'setCurrTask', task: currTask })
      return currTask
    },
    async setCurrLabel({ state, commit }, { labelId }) {
      console.log(labelId)
      let currLabel
      if (labelId) {
        let board = state.currBoard
        currLabel = board.labels.find((label) => label.id === labelId)
      } else {
        currLabel = null
      }
      commit({ type: 'setCurrLabel', label: currLabel })
    },
  },
}
