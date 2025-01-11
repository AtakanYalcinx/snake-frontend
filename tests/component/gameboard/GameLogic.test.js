import GameLogic from '../GameLogic';

describe('GameLogic Class', () => {
  let game;

  beforeEach(() => {
    // Mock Canvas
    const mockCanvas = document.createElement('canvas');
    mockCanvas.getContext = jest.fn(() => ({
      clearRect: jest.fn(),
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
    }));

    game = new GameLogic(mockCanvas, 3, '#ff0000', false, false, false, 1);
  });

  test('initializes with correct default values', () => {
    expect(game.snake.length).toBe(1);
    expect(game.snake[0]).toEqual({ x: 10, y: 10 });
    expect(game.score).toBe(0);
    expect(game.fruits.length).toBe(1);
  });

  test('moves snake correctly', () => {
    game.direction = 'RIGHT';
    game.moveSnake();
    expect(game.snake[0]).toEqual({ x: 11, y: 10 });
  });

  test('detects fruit collision and grows snake', () => {
    game.fruits = [{ x: 11, y: 10 }]; // Fruit directly in front of snake
    game.direction = 'RIGHT';
    game.moveSnake();
    game.checkFruitCollision();
    expect(game.snake.length).toBe(2); // Snake grows
    expect(game.score).toBe(1); // Score increases
  });

  test('ends game on wall collision when borderActive=true', () => {
    game.borderActive = true;
    game.snake[0] = { x: 0, y: 0 };
    game.direction = 'LEFT';
    game.moveSnake();
    expect(game.gameOver).toBe(true);
  });

  test('wraps snake around when borderActive=false', () => {
    game.borderActive = false;
    game.snake[0] = { x: 0, y: 0 };
    game.direction = 'LEFT';
    game.moveSnake();
    expect(game.snake[0].x).toBe(game.canvasSize / game.gridSize - 1); // Wrapped around
  });
});
