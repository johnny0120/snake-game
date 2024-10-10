import React, { useState, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

type Position = [number, number];

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [[10, 10]];
const INITIAL_DIRECTION: Position = [1, 0];
const INITIAL_FOOD: Position = [15, 15];

function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Position>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>(INITIAL_FOOD);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = newSnake[0];
    const newHead: Position = [
      (head[0] + direction[0] + GRID_SIZE) % GRID_SIZE,
      (head[1] + direction[1] + GRID_SIZE) % GRID_SIZE
    ];

    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore(prevScore => prevScore + 1);
      setFood(getRandomPosition());
    } else {
      newSnake.pop();
    }

    newSnake.unshift(newHead);

    if (isCollision(newHead, newSnake.slice(1))) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  }, [snake, direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          setDirection([0, -1]);
          break;
        case 'ArrowDown':
          setDirection([0, 1]);
          break;
        case 'ArrowLeft':
          setDirection([-1, 0]);
          break;
        case 'ArrowRight':
          setDirection([1, 0]);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    const gameLoop = setInterval(moveSnake, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(gameLoop);
    };
  }, [moveSnake]);

  const getRandomPosition = (): Position => {
    return [
      Math.floor(Math.random() * GRID_SIZE),
      Math.floor(Math.random() * GRID_SIZE)
    ];
  };

  const isCollision = (head: Position, body: Position[]): boolean => {
    return body.some(segment => segment[0] === head[0] && segment[1] === head[1]);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(INITIAL_FOOD);
    setGameOver(false);
    setScore(0);
  };

  const renderCell = (rowIndex: number, colIndex: number) => {
    if (snake.some(segment => segment[0] === colIndex && segment[1] === rowIndex)) {
      return <div key={`${rowIndex}-${colIndex}`} className="bg-black rounded-sm" style={{ width: CELL_SIZE, height: CELL_SIZE }}></div>;
    }
    if (food[0] === colIndex && food[1] === rowIndex) {
      return <div key={`${rowIndex}-${colIndex}`} className="bg-red-500 rounded-full" style={{ width: CELL_SIZE, height: CELL_SIZE }}></div>;
    }
    return <div key={`${rowIndex}-${colIndex}`} className="bg-gray-200" style={{ width: CELL_SIZE, height: CELL_SIZE }}></div>;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Snake Game</h1>
      <div className="mb-4">Score: {score}</div>
      <div className="grid gap-px bg-gray-300 p-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)` }}>
        {Array.from({ length: GRID_SIZE }).map((_, rowIndex) => (
          Array.from({ length: GRID_SIZE }).map((_, colIndex) => renderCell(rowIndex, colIndex))
        ))}
      </div>
      {gameOver && (
        <div className="mt-4">
          <p className="text-xl font-semibold mb-2">Game Over!</p>
          <button onClick={resetGame} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Play Again
          </button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button onClick={() => setDirection([0, -1])} className="p-2 bg-gray-200 rounded"><ChevronUp /></button>
        <button onClick={() => setDirection([-1, 0])} className="p-2 bg-gray-200 rounded"><ChevronLeft /></button>
        <button onClick={() => setDirection([1, 0])} className="p-2 bg-gray-200 rounded"><ChevronRight /></button>
        <div></div>
        <button onClick={() => setDirection([0, 1])} className="p-2 bg-gray-200 rounded"><ChevronDown /></button>
      </div>
    </div>
  );
}

export default App;