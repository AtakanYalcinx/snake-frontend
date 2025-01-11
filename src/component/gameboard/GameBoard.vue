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
// import GameModeService from '../gamemode/gameModeService' // ggf. nötig, s. Kommentar

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
      // 1) Prüfen, ob gerade ein Eingabefeld fokussiert ist
      //    Falls ja -> Nicht das Spiel steuern
      const activeTag = document.activeElement.tagName.toLowerCase()
      if (activeTag === 'input' || activeTag === 'textarea') {
        return
      }

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

      // Erst beim ersten Tastendruck -> Spiel starten, falls nicht schon
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
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap');

/* ----------- Grund-Layout & Typografie ----------- */
.container {
  display: flex;
  height: 100vh;
  font-family: 'Orbitron', sans-serif;
  background: linear-gradient(135deg, #1f1c2c, #928dab);
  color: #e0e0e0;
}

/* Linke Spalte (Form + Chat-Liste) */
.sidebar-left {
  width: 300px;
  padding: 20px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);
  overflow-y: auto;
}

.sidebar-left h3 {
  font-size: 20px;
  color: #00d2ff;
  text-shadow: 0 0 5px #00d2ff;
  margin-bottom: 1rem;
  text-align: center;
}

/* Hauptbereich Snake */
.game-board {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  box-shadow: inset 0 0 10px rgba(0, 210, 255, 0.2);
}

/* Überschriften und Text */
.game-board h2 {
  font-size: 28px;
  color: #00d2ff;
  text-shadow: 0 0 5px #00d2ff;
  margin-bottom: 10px;
}

.game-board p {
  font-size: 16px;
  color: #b0bec5;
  margin: 5px 0;
}

/* Canvas-Komponente */
.snake-canvas {
  border: 2px solid #00d2ff;
  border-radius: 8px;
  background-color: #1f1c2c;
  box-shadow: 0 4px 15px rgba(0, 210, 255, 0.3);
}

/* Overlay bei Game Over */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  animation: fadeInOverlay 0.5s ease-in-out;
}

@keyframes fadeInOverlay {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-over-text {
  font-size: 48px;
  color: #ff4081;
  text-shadow: 0 0 10px #ff4081, 0 0 20px #ff4081;
  margin-bottom: 20px;
  animation: popIn 0.3s ease-out;
}

@keyframes popIn {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.btn {
  padding: 12px 24px;
  font-size: 18px;
  background: linear-gradient(45deg, #00d2ff, #928dab);
  color: #fff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  margin: 10px;
  box-shadow: 0 4px 10px rgba(0, 210, 255, 0.3);
  transition: background 0.3s, transform 0.2s, box-shadow 0.3s;
  font-family: 'Orbitron', sans-serif;
}

.btn:hover {
  background: linear-gradient(45deg, #928dab, #00d2ff);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 210, 255, 0.4);
}

/* Responsive Anpassungen */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar-left {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .game-board {
    padding: 10px;
  }
}

.game-board {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; /* Volle Höhe des Viewports */
  background: radial-gradient(circle at top, #1b2735, #090a0f);
  overflow: hidden;
  color: white;
  padding: 20px;
}

.game-board::before, .game-board::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.game-board::before {
  background: transparent url('https://www.transparenttextures.com/patterns/stardust.png') repeat top center;
  z-index: 0;
}

.game-board::after {
  background: transparent url('https://www.transparenttextures.com/patterns/twinkling.png') repeat top center;
  animation: move-twinkling 20s linear infinite;
  z-index: 0;
  opacity: 0.5;
}

@keyframes move-twinkling {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}

/* Optional: Titel oder Überschriften, falls nötig */
.game-board h2 {
  position: relative;
  font-size: 64px;
  margin-bottom: 20px;
  z-index: 2; /* Über dem Hintergrund-Glow */
  color: #ffffff;
  text-shadow:
    0 0 10px rgba(0, 255, 255, 0.8),
    0 0 20px rgba(0, 255, 255, 0.6),
    0 0 30px rgba(0, 255, 255, 0.4),
    0 0 40px rgba(0, 255, 255, 0.2);
}

body, html {
  margin: 0;
  padding: 0;
  background: radial-gradient(circle at center, #1b2735, #090a0f); /* Gleicher Hintergrund wie im Spiel */
  height: 100%;
  overflow: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}


</style>
