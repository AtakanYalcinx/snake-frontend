<template>
  <div class="game-board">
    <h2>Snake Game</h2>
    <p>Gegessene Früchte: {{ score }}</p>

    <!-- Spielfeld -->
    <canvas id="gameCanvas" width="400" height="400"></canvas>

    <!-- Game Over Overlay -->
    <div v-if="gameOver" class="overlay">
      <h1 class="game-over-text">Game Over</h1>
      <button @click="restartGame" class="btn">Neustarten</button>
      <button @click="goToHomepage" class="btn">Zur Startseite</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GameBoard',
  data () {
    return {
      direction: 'RIGHT',
      snake: [{ x: 10, y: 10 }],
      gameInterval: null,
      ctx: null,
      gridSize: 20,
      canvasSize: 400,
      fruit: { x: 15, y: 15 },
      score: 0,
      hasEaten: false,
      gameOver: false
    }
  },
  methods: {
    changeDirection (event) {
      const key = event.keyCode

      // Steuerung (Pfeile und WASD)
      if (key === 37 && this.direction !== 'RIGHT') {
        this.direction = 'LEFT'
      } else if (key === 38 && this.direction !== 'DOWN') {
        this.direction = 'UP'
      } else if (key === 39 && this.direction !== 'LEFT') {
        this.direction = 'RIGHT'
      } else if (key === 40 && this.direction !== 'UP') {
        this.direction = 'DOWN'
      }

      if (key === 65 && this.direction !== 'RIGHT') {
        this.direction = 'LEFT'
      } else if (key === 87 && this.direction !== 'DOWN') {
        this.direction = 'UP'
      } else if (key === 68 && this.direction !== 'LEFT') {
        this.direction = 'RIGHT'
      } else if (key === 83 && this.direction !== 'UP') {
        this.direction = 'DOWN'
      }
    },

    updateGame () {
      if (this.gameOver) return

      this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)

      this.drawGrid()

      this.drawFruit()

      this.snake.forEach(part => {
        this.ctx.fillStyle = 'green'
        this.ctx.fillRect(part.x * this.gridSize, part.y * this.gridSize, this.gridSize, this.gridSize)
      })

      this.moveSnake()

      if (!this.hasEaten) {
        this.checkCollision()
      }

      this.checkFruitCollision()
      this.hasEaten = false
    },

    moveSnake () {
      const head = { ...this.snake[0] }

      if (this.direction === 'LEFT') head.x -= 1
      else if (this.direction === 'UP') head.y -= 1
      else if (this.direction === 'RIGHT') head.x += 1
      else if (this.direction === 'DOWN') head.y += 1

      this.snake.unshift(head)
      this.snake.pop()
    },

    drawGrid () {
      this.ctx.strokeStyle = '#ddd'
      for (let x = 0; x <= this.canvasSize; x += this.gridSize) {
        this.ctx.beginPath()
        this.ctx.moveTo(x, 0)
        this.ctx.lineTo(x, this.canvasSize)
        this.ctx.stroke()
      }
      for (let y = 0; y <= this.canvasSize; y += this.gridSize) {
        this.ctx.beginPath()
        this.ctx.moveTo(0, y)
        this.ctx.lineTo(this.canvasSize, y)
        this.ctx.stroke()
      }
    },

    drawFruit () {
      this.ctx.fillStyle = 'red'
      this.ctx.fillRect(this.fruit.x * this.gridSize, this.fruit.y * this.gridSize, this.gridSize, this.gridSize)
    },

    checkFruitCollision () {
      if (this.snake[0].x === this.fruit.x && this.snake[0].y === this.fruit.y) {
        this.snake.push({ ...this.snake[this.snake.length - 1] })
        this.score++

        this.fruit.x = Math.floor(Math.random() * (this.canvasSize / this.gridSize))
        this.fruit.y = Math.floor(Math.random() * (this.canvasSize / this.gridSize))

        this.hasEaten = true
      }
    },

    checkCollision () {
      const head = this.snake[0]

      if (head.x < 0 || head.x >= this.canvasSize / this.gridSize || head.y < 0 || head.y >= this.canvasSize / this.gridSize) {
        this.endGame()
      }

      for (let i = 1; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          this.endGame()
        }
      }
    },

    endGame () {
      clearInterval(this.gameInterval)
      this.gameOver = true
    },

    restartGame () {
      this.gameOver = false
      this.snake = [{ x: 10, y: 10 }]
      this.score = 0
      this.direction = 'RIGHT'
      this.fruit = { x: 15, y: 15 }
      this.hasEaten = false
      this.gameInterval = setInterval(this.updateGame, 100)
    },

    goToHomepage () {
      this.$router.push('/')
    }
  },

  mounted () {
    window.addEventListener('keydown', this.changeDirection)
    const canvas = document.getElementById('gameCanvas')
    this.ctx = canvas.getContext('2d')
    this.gameInterval = setInterval(this.updateGame, 100)
  },

  beforeUnmount () {
    window.removeEventListener('keydown', this.changeDirection)
    if (this.gameInterval) clearInterval(this.gameInterval)
  }
}
</script>

<style scoped>
.game-board {
  text-align: center;
  margin-top: 20px;
}

canvas {
  border: 2px solid black;
  display: block;
  margin: 0 auto;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
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
