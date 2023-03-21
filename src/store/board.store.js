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

export const boardStore = {
  state: {
    boards: [],
    currTask: null,
    groups: [],
  },
  getters: {
    boards({ boards }) {
      console.log('BOARDS', boards)
      return boards
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
    removeBoard(state, { boardId }) {
      state.boards = state.boards.filter((board) => board._id !== boardId)
    },
    addBoardMsg(state, { boardId, msg }) {
      const board = state.boards.find((board) => board._id === boardId)
      if (!board.msgs) board.msgs = []
      board.msgs.push(msg)
    },
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
        console.log('boards', boards)
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
    async loadGroups(context, { boardId }) {
      try {
        const groups = await boardService.queryGroups(boardId)
        context.commit({ type: 'setGroups', groups })
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
  },
}
