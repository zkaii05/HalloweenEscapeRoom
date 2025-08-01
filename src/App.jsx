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
const rightAnswer = 5
const wrongAnswer = 2

function App() {
  const [clickedBoxes, setClickedBoxes] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing', 'won', 'failed'
  const [indicators, setIndicators] = useState([]);
  const [attempts, setAttempts] = useState(1);
  const resetGame = () => {
    setClickedBoxes([]);
    setTimeLeft(TOTAL_TIME);
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('failed');
          if (prev <= 1) {
            clearInterval(timer);
            setGameStatus(attempts + 1 < 4 ? 'failed' : 'gameover');
            return 0;
          }
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

  const handleBoxClick = (id, position) => {
    if (gameStatus !== 'playing') return;

    const newIndicator = (text, color, position) => {
      const indicatorId = Date.now() + Math.random(); // unique ID
      setIndicators(prev => [...prev, { id: indicatorId, text, color, ...position }]);
      setTimeout(() => {
        setIndicators(prev => prev.filter(ind => ind.id !== indicatorId));
      }, 1200); // match animation duration
    };

    // If it's explicitly marked wrong, show only red
    if (id === 'wrong') {
      console.log('[WRONG] Clicked a wrong box at position:', position);
      setTimeLeft(prev => Math.max(prev - wrongAnswer, 0));
      newIndicator('–2s', 'red', position);
      return;
    }

    // Only check if it's correct if not 'wrong'
    const isCorrect = baseBoxes.some(box => box.id === id);

    if (isCorrect && !clickedBoxes.includes(id)) {
      console.log('[CORRECT] Found a difference! Box ID:', id, 'at position:', position);
      setClickedBoxes(prev => {
        const updated = [...prev, id];
        console.log('[STATE] Clicked boxes updated:', updated);
        return updated;
      });
      setTimeLeft(prev => Math.min(prev + rightAnswer, TOTAL_TIME));
      newIndicator('+5s', 'green', position);
    }
  };  

  const progressPercent = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="container">
      <div className="headspace">
  <p>Tries used: {attempts} / 3</p>
</div>
      <div className="top-row">
        <ImageCell
          label="Left Image"
          src="/image-left.jpg"
          boxes={baseBoxes}
          clickedBoxes={clickedBoxes}
          onBoxClick={handleBoxClick}
          indicators={indicators} // ✅ pass it in
        />
        <ImageCell
          label="Right Image"
          src="/image-right.jpg"
          boxes={baseBoxes}
          clickedBoxes={clickedBoxes}
          onBoxClick={handleBoxClick}
          indicators={indicators} // ✅ pass it in
        />
      </div>
      <div className="bottom-row">
        {gameStatus === 'playing' && (
          <>
            <p>{clickedBoxes.length} / {TOTAL_DIFFERENCES} differences found</p>
            <div className="timer-container">
              <div className="timer-bar" style={{ width: `${progressPercent}%` }} />
              <div className="timer-label">{timeLeft}s remaining</div>
              <div className="indicators">
                {indicators.map(ind => (
                  <div
                    key={ind.id}
                    className="indicator"
                    style={{ color: ind.color }}
                  >
                    {ind.text}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {gameStatus === 'won' && (
          <div className="game-result success">🎉 You found all the differences! You win!</div>
        )}

        {gameStatus === 'failed' && (
          <button
            className="retry-button"
            onClick={() => {
              setAttempts(prev => prev + 1);
              resetGame();
            }}
          >
            ⏰ Time’s up! Press here to try again
          </button>
        )}

        {gameStatus === 'gameover' && (
          <div className="game-result fail">🚫 No more tries left. Please ask NPC for help.</div>
        )}

      </div>
    </div>
  );
}

export default App;