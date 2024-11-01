import { createStore } from 'vuex'

export default createStore({
  state: {
    player: {
      username: '',
      level: 0,
      experiencePoints: 0,
      totalScore: 0
    },
    game: {
      score: 0,
      snake: [{ x: 10, y: 10 }],
      food: { x: 5, y: 5 },
      gameOver: false
    },
    highscores: []
  },
  mutations: {
    // Spielerinformationen setzen
    setPlayer (state, playerData) {
      state.player = playerData
    },

    // Punktestand im Spiel aktualisieren
    updateScore (state, score) {
      state.game.score = score
    },

    // Spielfeldzustand aktualisieren (Schlange und Essen)
    updateGameState (state, gameState) {
      state.game.snake = gameState.snake
      state.game.food = gameState.food
    },

    // Spielende festlegen
    setGameOver (state, isGameOver) {
      state.game.gameOver = isGameOver
    },

    // Highscores setzen
    setHighscores (state, highscores) {
      state.highscores = highscores
    }
  },
  actions: {
    // Spielerprofil vom Backend laden
    async fetchPlayerProfile ({ commit }) {
      try {
        const response = await fetch('/api/players/1')
        const data = await response.json()
        commit('setPlayer', data)
      } catch (error) {
        console.error('Error fetching player profile:', error)
      }
    },

    // Highscores vom Backend laden
    async fetchHighscores ({ commit }) {
      try {
        const response = await fetch('/api/highscores/top10')
        const data = await response.json()
        commit('setHighscores', data)
      } catch (error) {
        console.error('Error fetching highscores:', error)
      }
    },

    // Punktestand während des Spiels aktualisieren
    updateGameScore ({ commit }, score) {
      commit('updateScore', score)
    },

    // Spielzustand aktualisieren (Schlange und Essen)
    updateGameBoard ({ commit }, gameState) {
      commit('updateGameState', gameState)
    },

    // Spiel beenden
    endGame ({ commit }) {
      commit('setGameOver', true)
    },

    // Neues Spiel starten
    startNewGame ({ commit }) {
      commit('updateScore', 0) // Score auf 0 setzen
      commit('setGameOver', false) // Spielstatus auf "nicht beendet" setzen
      commit('updateGameState', {
        snake: [{ x: 10, y: 10 }],
        food: { x: 5, y: 5 }
      }) // Startzustand für Schlange und Essen setzen
    }
  },
  getters: {
    // Gibt das Spielerprofil zurück
    playerProfile (state) {
      return state.player
    },

    // Gibt den aktuellen Punktestand zurück
    currentScore (state) {
      return state.game.score
    },

    // Gibt den Zustand des Spiels zurück (Schlange, Essen, Spielstatus)
    gameState (state) {
      return state.game
    },

    // Gibt die Liste der Highscores zurück
    allHighscores (state) {
      return state.highscores
    }
  }
})
