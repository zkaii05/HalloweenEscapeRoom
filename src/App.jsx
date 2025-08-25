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
const gamePassword = import.meta.env.VITE_GAME_PASSWORD; // Vite
const attempt = 2
const video1 = "videos/Scare video 1.mp4"
const video2 = "videos/Scare video 2.mp4"

function App() {
  const [tryAgainAttemptIndex, setTryAgainAttemptIndex] = useState(1);

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
  const [showIntro, setShowIntro] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showClue, setShowClue] = useState(false);
  const [showClueVideo, setShowClueVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  const handleVideoEnd = () => {
    setVideoEnded(true);
  };

  const handleRewatch = () => {
    setVideoEnded(false);
    const video = document.getElementById("clueVideo");
    if (video) {
      video.currentTime = 0;
      video.play();
    }
  };

  useEffect(() => {
    if (showIntro || gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus(attempts + 1 < attempt + 1 ? 'failed' : 'gameover');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showIntro, gameStatus, attempts]);

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
      setClickedBoxes(prev => {
        const updated = [...prev, id];
        return updated;
      });
      setTimeLeft(prev => Math.min(prev + rightAnswer, TOTAL_TIME));
      newIndicator('+5s', 'green', position);
    }
  };  

  const progressPercent = (timeLeft / TOTAL_TIME) * 100;

  return (
    <div className="container">
      {showIntro ? (
        <div className="intro-screen">
          <h1>🧠 Spot the Difference Game</h1>
          <p>You have {attempt} tries to spot all {TOTAL_DIFFERENCES} differences between the two images.</p>
          <ul>
            <li>Click on areas you think are different.</li>
            <li>Correct click: +5 seconds</li>
            <li>Wrong click: -2 seconds</li>
            <li>You have {TOTAL_TIME} seconds per attempt.</li>
          </ul>
          <button
            className="start-button"
            onClick={() => {
              resetGame();
              setShowIntro(false);
            }}
          >
            ▶ Start Game
          </button>
        </div>
      ) : (
        <>
          <div className="headspace">
            <p>Tries used: {attempts} / {attempt}</p>
          </div>
  
          <div className="top-row">
            <ImageCell
              label="Left Image"
              src="image-left.jpg"
              boxes={baseBoxes}
              clickedBoxes={clickedBoxes}
              onBoxClick={handleBoxClick}
              indicators={indicators}
            />
            <ImageCell
              label="Right Image"
              src="image-right.jpg"
              boxes={baseBoxes}
              clickedBoxes={clickedBoxes}
              onBoxClick={handleBoxClick}
              indicators={indicators}
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
                <div className="game-result success">
                  <img src="success.jpeg" alt="You win!" className="success-image" />
                </div>
              )}

              {gameStatus === 'failed' && !showPasswordPrompt && (
                <button
                  className="retry-button"
                  onClick={() => {
                    setShowPasswordPrompt(true);
                  }}
                >
                  ⏰ Time’s up! Press here to try again
                </button>
              )}

              {/* Password + Clue Section */}
              {showPasswordPrompt && (
                <div className="overlay-container">

                  <div className="content-stack">
                    {/* Clue Video (appears above password prompt, not overlapping) */}
                    {showClueVideo && (
                      <div className="clue-video-container">
                        <video
                          id="clueVideo"
                          autoPlay
                          controls={false}
                          playsInline
                          onEnded={() => setVideoEnded(true)}
                        >
                          <source src={video1} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        {videoEnded && (
                          <button
                            className="try-again"
                            onClick={() => {
                              setVideoEnded(false);

                              const video = document.getElementById("clueVideo");

                              if (video) {
                                if (tryAgainAttemptIndex === 1) {
                                  video.src = video2;
                                  video.load();
                                  video.play();
                                  setTryAgainAttemptIndex(2); // mark first try done
                                } else {
                                  video.src = video1;
                                  video.load();
                                  video.play();
                                }
                              }                              
                            }}
                          >
                            🔄 Try Again?
                          </button>
                        )}

                      </div>
                    )}

                    {/* Password Box (centered when alone, pushed down if video appears) */}
                    <div className="password-prompt">
                      <p>🔐 Enter 4-digit password:</p>
                      <div className="password-input-group">
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={4}
                          className={`password-input ${passwordError === "wrong" ? "wrong-password" :
                              passwordError === "correct" ? "celebrate-password" : ""
                            }`}
                          value={passwordInput}
                          placeholder="Enter 4-digit password"
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, '');
                            setPasswordInput(digitsOnly);
                            setPasswordError('');
                          }}
                        />
                        <span className="digit-count">{4 - passwordInput.length} digits left</span>
                      </div>

                      <div className="password-actions">
                        <button onClick={() => {
                          const correctPassword = gamePassword;
                          if (passwordInput === correctPassword) {
                            const video = document.getElementById("clueVideo");
                            if (video) {
                              video.pause();
                              video.currentTime = 0;
                              setShowClueVideo(false);
                            }
                            setPasswordError("correct");
                            setTimeout(() => {
                              setShowPasswordPrompt(false);
                              resetGame();
                              setAttempts(attempts + 1);
                            }, 3000);
                          } else {
                            setPasswordError("wrong");
                          }
                        }}>
                          ✅ Submit
                        </button>

                        <button className="clue-button" onClick={() => {
                          setShowClueVideo(true);
                          setVideoEnded(false);
                      }}>
                        💡 Clue
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameStatus === 'gameover' && (
              <div className="game-result fail">🚫 No more tries left. Please look for NPC for help.</div>
            )}
          </div>
        </>
      )}
    </div>
  );

}

export default App;
