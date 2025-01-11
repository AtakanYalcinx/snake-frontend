import GameLogic from '../../src/component/gameboard/GameLogic';

describe('GameLogic Tests', () => {
  let canvas;
  let game;

  beforeEach(() => {
    canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    game = new GameLogic(canvas);
  });

  test('should initialize game with default values', () => {
    expect(game.snake).toEqual([{ x: 10, y: 10 }]);
    expect(game.score).toBe(0);
    expect(game.gameOver).toBe(false);
    expect(game.direction).toBe('RIGHT');
  });

  test('should move snake to the right by default', () => {
    game.moveSnake();
    expect(game.snake[0]).toEqual({ x: 11, y: 10 });
  });

  test('should detect collision with fruit', () => {
    game.fruits = [{ x: 11, y: 10 }];
    game.moveSnake();
    game.checkFruitCollision();
    expect(game.score).toBe(1);
    expect(game.snake.length).toBe(2);
  });

  test('should end game if snake hits wall when borderActive is true', () => {
    game.borderActive = true;
    game.snake[0] = { x: 0, y: 0 };
    game.direction = 'LEFT';
    game.moveSnake();
    expect(game.gameOver).toBe(true);
  });

  test('should handle wall collisions when borderActive is false', () => {
    game.borderActive = false;
    game.snake[0] = { x: 0, y: 0 };
    game.direction = 'LEFT';
    game.moveSnake();
    expect(game.snake[0].x).toBe(game.canvasSize / game.gridSize - 1);
  });

  test('should correctly calculate score when fruit is eaten', () => {
    game.fruits = [{ x: 11, y: 10 }];
    game.moveSnake();
    game.checkFruitCollision();
    expect(game.score).toBe(1);
  });


  test('should reset the game state on restart', () => {
    game.score = 10;
    game.snake = [{ x: 15, y: 15 }];
    game.restartGame();
    expect(game.score).toBe(0);
    expect(game.snake).toEqual([{ x: 10, y: 10 }]);
    expect(game.gameOver).toBe(false);
  });

  test('should update game settings', () => {
    game.updateSettings({ speed: 5, fruitColor: '#0000FF', fruitCount: 3 });
    expect(game.speed).toBe(5);
    expect(game.fruitColor).toBe('#0000FF');
    expect(game.fruitCount).toBe(3);
  });

  test('should end game when snake collides with itself', () => {
    game.snakeCanTouchItself = false;
    game.snake = [{ x: 10, y: 10 }, { x: 11, y: 10 }, { x: 10, y: 10 }];
    game.checkCollision();
    expect(game.gameOver).toBe(true);
  });

  test('should generate a valid fruit position within bounds', () => {
    const position = game.randomFruitPosition();
    expect(position.x).toBeGreaterThanOrEqual(0);
    expect(position.x).toBeLessThan(game.canvasSize / game.gridSize);
    expect(position.y).toBeGreaterThanOrEqual(0);
    expect(position.y).toBeLessThan(game.canvasSize / game.gridSize);
  });

  test('should end game if snake collides with obstacle', () => {
    // Erstelle ein Canvas-Element
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;

    // Initialisiere GameLogic mit den erforderlichen Flags
    const game = new GameLogic(canvas);
    game.borderActive = true; // Aktivieren der Randlogik
    game.randomObstacles = true; // Aktivieren der Hindernislogik

    // Füge ein Hindernis hinzu
    game.obstacles = [{ x: 10, y: 10 }];
    // Setze den Kopf der Schlange auf das Hindernis
    game.snake[0] = { x: 10, y: 10 };

    // Prüfe die Kollision
    game.checkCollision();

    // Erwartung: Das Spiel endet
    expect(game.gameOver).toBe(true);
  });





});
