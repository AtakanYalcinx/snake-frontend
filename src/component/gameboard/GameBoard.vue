<template>
  <div class="container">
    <!-- Sidebar links: GameModeForm mit Chat-Liste + Formular -->
    <div class="sidebar-left">
      <h3>Game Mode Einstellungen</h3>
      <GameModeForm
        :editGameMode="currentEditMode"
        @saved="onGameModeSaved"
        @close="onFormClose"
        @use-mode="useSelectedMode"
      />
    </div>

    <!-- Hauptbereich: Snake Game -->
    <div class="game-board">
      <h2>Snake Game</h2>
      <p>Gegessene Früchte: {{ logic ? logic.score : 0 }}</p>
      <p v-if="logic">Aktueller Spielmodus: {{ currentGameModeName }}</p>

      <!-- Canvas-Komponente -->
      <SnakeCanvas ref="snakeCanvas" />

      <!-- Overlay bei Game Over -->
      <div v-if="logic && logic.gameOver" class="overlay">
        <h1 class="game-over-text">Game Over</h1>
        <button @click="restartGame" class="btn">Neustarten</button>
        <button @click="goToHomepage" class="btn">Zur Startseite</button>
      </div>
    </div>
  </div>
</template>

<script>
import SnakeCanvas from './SnakeCanvas.vue'
import GameLogic from './GameLogic.js'
import GameModeForm from '../gamemode/GameModeForm.vue'
import GameModeService from '../gamemode/gameModeService' // ggf. noch benötigt

export default {
  name: 'GameBoard',
  components: {
    SnakeCanvas,
    GameModeForm
  },
  data () {
    return {
      logic: null,
      gameInterval: null,
      gameStarted: false,
      currentEditMode: null,     // aktuelles GameMode-Objekt für Edit
      currentGameModeName: 'Default Mode',

      // Standardmodus, wird initial verwendet
      defaultGameMode: {
        name: 'Default Mode',
        description: 'A basic snake mode',
        speed: 3,
        fruitColor: '#ff0000',
        snakeCanTouchItself: false,
        borderActive: false,
        randomObstacles: false,
        fruitCount: 1
      }
    }
  },
  methods: {
    /**
     * Steuerung per Tastatur
     */
    changeDirection (event) {
      if (!this.logic) return
      const key = event.keyCode

      // Pfeiltasten
      if (key === 37 && this.logic.direction !== 'RIGHT') this.logic.direction = 'LEFT'
      else if (key === 38 && this.logic.direction !== 'DOWN') this.logic.direction = 'UP'
      else if (key === 39 && this.logic.direction !== 'LEFT') this.logic.direction = 'RIGHT'
      else if (key === 40 && this.logic.direction !== 'UP') this.logic.direction = 'DOWN'

      // WASD
      if (key === 65 && this.logic.direction !== 'RIGHT') this.logic.direction = 'LEFT'
      else if (key === 87 && this.logic.direction !== 'DOWN') this.logic.direction = 'UP'
      else if (key === 68 && this.logic.direction !== 'LEFT') this.logic.direction = 'RIGHT'
      else if (key === 83 && this.logic.direction !== 'UP') this.logic.direction = 'DOWN'

      // Beim ersten Tastendruck: Spiel starten (falls nicht schon gestartet)
      if (!this.gameStarted && this.logic && !this.logic.gameOver) {
        this.startGameInterval()
        this.gameStarted = true
      }
    },

    /**
     * Startet/aktualisiert das Intervall fürs Snake-Bewegen
     */
    startGameInterval () {
      const intervalTime = 200 / this.logic.speed
      // Altes Interval beenden
      if (this.gameInterval) {
        clearInterval(this.gameInterval)
      }
      // Neues Intervall setzen
      this.gameInterval = setInterval(() => {
        if (this.logic && !this.logic.gameOver) {
          this.logic.updateGame()
        }
      }, intervalTime)
    },

    /**
     * Spiel neu starten
     */
    restartGame () {
      if (this.logic) {
        this.logic.restartGame()
      }
      this.gameStarted = false
    },

    /**
     * Gehe zurück zur Homepage (z.B. mit Vue Router)
     */
    goToHomepage () {
      this.$router.push('/')
    },

    /**
     * Wendet die Einstellungen (speed etc.) sofort im laufenden Spiel an
     */
    applySettingsToLogic (mode) {
      if (this.logic && mode) {
        this.logic.speed = mode.speed
        this.logic.fruitColor = mode.fruitColor
        this.logic.snakeCanTouchItself = mode.snakeCanTouchItself
        this.logic.borderActive = mode.borderActive
        this.logic.randomObstacles = mode.randomObstacles
        this.logic.fruitCount = mode.fruitCount
        this.currentGameModeName = mode.name || 'Custom Mode'

        // Falls das Spiel läuft, neues Intervall starten
        if (this.gameStarted && !this.logic.gameOver) {
          this.startGameInterval()
        }
      }
    },

    /**
     * Wird aufgerufen, wenn GameModeForm "use-mode" emittet.
     */
    useSelectedMode (mode) {
      this.applySettingsToLogic(mode)
      // Optional: Setze currentEditMode = geklickter Modus
      this.currentEditMode = { ...mode }
    },

    /**
     * Wenn in GameModeForm ein Modus gespeichert (created/updated) wurde
     */
    onGameModeSaved () {
      // Du kannst hier z.B. eine Meldung anzeigen
      console.log('GameMode wurde gespeichert!')
      // currentEditMode auf null -> Formular wieder leeren
      this.currentEditMode = null
    },

    /**
     * Wenn das Formular "close" emittet (Cancel-Button)
     */
    onFormClose () {
      this.currentEditMode = null
    }
  },
  mounted () {
    window.addEventListener('keydown', this.changeDirection)
    // Canvas-Referenz holen
    const canvas = this.$refs.snakeCanvas.getCanvas()

    // Initialisiere GameLogic mit Standardmode
    const m = this.defaultGameMode
    this.logic = new GameLogic(
      canvas,
      m.speed,
      m.fruitColor,
      m.snakeCanTouchItself,
      m.borderActive,
      m.randomObstacles,
      m.fruitCount
    )
  },
  beforeUnmount () {
    window.removeEventListener('keydown', this.changeDirection)
    if (this.gameInterval) {
      clearInterval(this.gameInterval)
    }
  }
}
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
}

/* Linke Spalte (Form + Chat-Liste) */
.sidebar-left {
  width: 250px;
  padding: 10px;
  border-right: 1px solid #ccc;
  overflow-y: auto; /* Falls die Liste lang wird */
}

/* Hauptbereich Snake */
.game-board {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.game-over-text {
  font-size: 48px;
  color: white;
  margin-bottom: 20px;
}

.btn {
  padding: 10px 20px;
  font-size: 18px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
}
.btn:hover {
  background-color: #45a049;
}
</style>
