import { createStore } from 'vuex'

export default createStore({
  state: {
    game: {
      score: 0,
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      gameOver: false
    }
  },
  mutations: {
    updateScore (state, score) {
      state.game.score = score
    },
    updateGameState (state, gameState) {
      state.game.snake = gameState.snake
      state.game.food = gameState.food
    },
    setGameOver (state, isGameOver) {
      state.game.gameOver = isGameOver
    }
  },
  actions: {
    updateGameScore ({ commit }, score) {
      commit('updateScore', score)
    },
    updateGameBoard ({ commit }, gameState) {
      commit('updateGameState', gameState)
    },
    endGame ({ commit }) {
      commit('setGameOver', true)
    },
    startNewGame ({ commit }) {
      commit('updateScore', 0)
      commit('setGameOver', false)
      commit('updateGameState', {
        snake: [{ x: 10, y: 10 }],
        food: { x: 5, y: 5 }
      })
    }
  },
  getters: {
    currentScore (state) {
      return state.game.score
    },
    gameState (state) {
      return state.game
    }
  }
})
