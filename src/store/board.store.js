// import { boardService } from '../services/board.service.local'
import { boardService } from '../services/board.service.local'

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
// GROUPS
export function getActionRemoveGroup(groupId) {
  return {
    type: 'removeGroup',
    groupId,
  }
}
export function getActionAddGroup(group) {
  return {
    type: 'addGroup',
    group,
  }
}
export function getActionUpdateGroup(group) {
  return {
    type: 'updateGroup',
    group,
  }
}
export function getActionAddGroupMsg(groupId) {
  return {
    type: 'addGroupMsg',
    groupId,
    txt: 'Stam txt',
  }
}
export function getActionLoadGroups(boardId) {
  return {
    type: 'loadGroups',
    boardId,
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
export function getActionAddTaskMsg(taskId) {
  return {
    type: 'addTaskMsg',
    taskId,
    txt: 'Stam txt',
  }
}

export const boardStore = {
  state: {
    boards: [],
    groups: [],
    currBoard: null,
    currGroup: null,
    currTask: null,
  },
  getters: {
    boards({ boards }) {
      return boards
    },
    currBoard({ currBoard }) {
      return currBoard
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
    addBoardMsg(state, { boardId, msg }) {
      const board = state.boards.find((board) => board._id === boardId)
      if (!board.msgs) board.msgs = []
      board.msgs.push(msg)
    },
    setCurrBoard(state, { board }) {
      state.currBoard = board
    },

    // GROUPS

    setGroups(state, { groups }) {
      state.groups = groups
    },
    addGroup(state, { group }) {
      state.groups.push(group)
    },
    updateGroup(state, { group }) {
      const idx = state.groups.findIndex((g) => g._id === group._id)
      state.groups.splice(idx, 1, group)
    },
    removeGroup(state, { groupId }) {
      state.groups = state.groups.filter((group) => group._id !== groupId)
    },
    //  TASKS
    savedTask(state, { task }) {
      state.currGroup.tasks.push(task)
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
    // GROUPS
    async loadGroups(context, { boardId }) {
      try {
        const groups = await boardService.queryGroups(boardId)
        context.commit({ type: 'setGroups', groups })
        return groups
      } catch (err) {
        console.log('boardStore: Error in loadGroups', err)
        throw err
      }
    },
    async addGroup(context, { group }) {
      try {
        group = await boardService.save(group)
        context.commit(getActionAddGroup(group))
        return group
      } catch (err) {
        console.log('boardStore: Error in addGroup', err)
        throw err
      }
    },
    async updateGroup(context, { group }) {
      try {
        group = await boardService.save(group)
        context.commit(getActionUpdateGroup(group))
        return group
      } catch (err) {
        console.log('boardStore: Error in updateGroup', err)
        throw err
      }
    },
    async removeGroup(context, { groupId }) {
      try {
        await boardService.remove(groupId)
        context.commit(getActionRemoveGroup(groupId))
      } catch (err) {
        console.log('boardStore: Error in removeGroup', err)
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
  },
}
