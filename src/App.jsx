// src/App.jsx
import React, { useState, useEffect } from 'react';
import ImageCell from './components/ImageCell';
import './App.css';

const baseBoxes = [
  { id: 1, top: '41%', left: '9%', width: '6%', height: '11%' },
  { id: 2, top: '35%', left: '33%', width: '20%', height: '14%' },
  { id: 3, top: '44%', left: '52%', width: '5%', height: '9%' },
  { id: 4, top: '49%', left: '74%', width: '20%', height: '14%' },
  { id: 5, top: '85%', left: '38%', width: '10%', height: '14%' },
  { id: 6, top: '77%', left: '4%', width: '6%', height: '9%' },
  { id: 7, top: '62.5%', left: '16%', width: '5%', height: '10%' },
  { id: 8, top: '86%', left: '69%', width: '6%', height: '9%' },
  { id: 9, top: '18%', left: '48%', width: '5%', height: '7%' },
];

const TOTAL_TIME = 30; // seconds
const TOTAL_DIFFERENCES = baseBoxes.length;

function App() {
  const [clickedBoxes, setClickedBoxes] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'failed'

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  useEffect(() => {
    if (clickedBoxes.length === TOTAL_DIFFERENCES && gameStatus === 'playing') {
      setGameStatus('won');
    }
  }, [clickedBoxes, gameStatus]);

  const handleBoxClick = (id) => {
    if (gameStatus !== 'playing') return;

    if (id === 'wrong') {
      setTimeLeft(prev => Math.max(prev - 2, 0));
      return;
    }

    const isCorrect = baseBoxes.some(box => box.id === id);

    if (isCorrect && !clickedBoxes.includes(id)) {
      setClickedBoxes([...clickedBoxes, id]);
      setTimeLeft(prev => Math.min(prev + 5, TOTAL_TIME));
    }
  };

  const progressPercent = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="container">
      <div className="top-row">
        <ImageCell
          label="Left Image"
          src="/image-left.jpg"
          boxes={baseBoxes}
          clickedBoxes={clickedBoxes}
          onBoxClick={handleBoxClick}
        />
        <ImageCell
          label="Right Image"
          src="/image-right.jpg"
          boxes={baseBoxes}
          clickedBoxes={clickedBoxes}
          onBoxClick={handleBoxClick}
        />
      </div>
      <div className="bottom-row">
        {gameStatus === 'playing' && (
          <>
            <p>{clickedBoxes.length} / {TOTAL_DIFFERENCES} differences found</p>
            <div className="timer-container">
              <div className="timer-bar" style={{ width: `${progressPercent}%` }} />
              <div className="timer-label">{timeLeft}s remaining</div>
            </div>
          </>
        )}

        {gameStatus === 'won' && (
          <div className="game-result success">🎉 You found all the differences! You win!</div>
        )}

        {gameStatus === 'failed' && (
          <div className="game-result fail">⏰ Time’s up! You failed. Try again!</div>
        )}
      </div>
    </div>
  );
}

export default App;