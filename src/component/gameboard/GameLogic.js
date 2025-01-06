export default class GameLogic {
  constructor (
    canvas,
    initialSpeed,
    fruitColor = '#ff0000',
    snakeCanTouchItself = false,
    borderActive = false,
    randomObstacles = false,
    fruitCount = 1
  ) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.gridSize = 20
    this.canvasSize = 400
    this.direction = 'RIGHT'
    this.snake = [{ x: 10, y: 10 }]
    this.score = 0
    this.hasEaten = false
    this.gameOver = false

    this.speed = initialSpeed
    this.fruitColor = fruitColor
    this.snakeCanTouchItself = snakeCanTouchItself
    this.borderActive = borderActive
    this.randomObstacles = randomObstacles
    this.fruitCount = fruitCount

    this.fruits = []
    for (let i = 0; i < this.fruitCount; i++) {
      this.fruits.push(this.randomFruitPosition())
    }

    this.obstacles = []
    if (this.borderActive && this.randomObstacles) {
      for (let i = 0; i < 5; i++) {
        this.obstacles.push(this.randomObstaclePosition())
      }
    }
  }

  randomFruitPosition () {
    return {
      x: Math.floor(Math.random() * (this.canvasSize / this.gridSize)),
      y: Math.floor(Math.random() * (this.canvasSize / this.gridSize))
    }
  }

  randomObstaclePosition () {
    return {
      x: Math.floor(Math.random() * (this.canvasSize / this.gridSize)),
      y: Math.floor(Math.random() * (this.canvasSize / this.gridSize))
    }
  }

  updateGame () {
    if (this.gameOver) return

    this.ctx.clearRect(0, 0, this.canvasSize, this.canvasSize)
    this.drawGrid()
    this.drawObstacles()
    this.drawFruits()

    this.snake.forEach((part) => {
      this.ctx.fillStyle = 'green'
      this.ctx.fillRect(
        part.x * this.gridSize,
        part.y * this.gridSize,
        this.gridSize,
        this.gridSize
      )
    })

    this.moveSnake()

    if (!this.hasEaten) {
      this.checkCollision()
    }

    this.checkFruitCollision()
    this.hasEaten = false
  }

  moveSnake () {
    const head = { ...this.snake[0] }

    if (this.direction === 'LEFT') head.x -= 1
    else if (this.direction === 'UP') head.y -= 1
    else if (this.direction === 'RIGHT') head.x += 1
    else if (this.direction === 'DOWN') head.y += 1

    if (this.borderActive) {
      if (head.x < 0 || head.x >= this.canvasSize / this.gridSize ||
        head.y < 0 || head.y >= this.canvasSize / this.gridSize) {
        this.endGame()
        return
      }
    } else {
      if (head.x < 0) head.x = (this.canvasSize / this.gridSize) - 1
      else if (head.x >= this.canvasSize / this.gridSize) head.x = 0
      if (head.y < 0) head.y = (this.canvasSize / this.gridSize) - 1
      else if (head.y >= this.canvasSize / this.gridSize) head.y = 0
    }

    this.snake.unshift(head)
    this.snake.pop()
  }

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
  }

  drawFruits () {
    this.ctx.fillStyle = this.fruitColor
    this.fruits.forEach((fruit) => {
      this.ctx.fillRect(
        fruit.x * this.gridSize,
        fruit.y * this.gridSize,
        this.gridSize,
        this.gridSize
      )
    })
  }

  drawObstacles () {
    if (this.obstacles.length > 0) {
      this.ctx.fillStyle = 'grey'
      this.obstacles.forEach((obs) => {
        this.ctx.fillRect(
          obs.x * this.gridSize,
          obs.y * this.gridSize,
          this.gridSize,
          this.gridSize
        )
      })
    }
  }

  checkFruitCollision () {
    const head = this.snake[0]
    for (let i = 0; i < this.fruits.length; i++) {
      const fruit = this.fruits[i]
      if (head.x === fruit.x && head.y === fruit.y) {
        this.snake.push({ ...this.snake[this.snake.length - 1] })
        this.score++
        this.fruits[i] = this.randomFruitPosition()
        this.hasEaten = true
      }
    }
  }

  checkCollision () {
    const head = this.snake[0]

    if (!this.snakeCanTouchItself) {
      for (let i = 1; i < this.snake.length; i++) {
        if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
          this.endGame()
          return
        }
      }
    }

    if (this.borderActive && this.randomObstacles) {
      for (const obs of this.obstacles) {
        if (head.x === obs.x && head.y === obs.y) {
          this.endGame()
          return
        }
      }
    }
  }

  endGame () {
    this.gameOver = true
  }

  restartGame () {
    this.gameOver = false
    this.snake = [{ x: 10, y: 10 }]
    this.score = 0
    this.direction = 'RIGHT'
    this.hasEaten = false

    this.fruits = []
    for (let i = 0; i < this.fruitCount; i++) {
      this.fruits.push(this.randomFruitPosition())
    }

    this.obstacles = []
    if (this.borderActive && this.randomObstacles) {
      for (let i = 0; i < 5; i++) {
        this.obstacles.push(this.randomObstaclePosition())
      }
    }
  }
}
