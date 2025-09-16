// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import ImageCell from './components/ImageCell';
import './App.css';

// locating correct answers
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

// Basic var
const TOTAL_TIME = 30; // seconds
const TOTAL_DIFFERENCES = baseBoxes.length + 1;
const rightAnswer = 5
const wrongAnswer = 2
const gamePassword = import.meta.env.VITE_GAME_PASSWORD;
const attempt = 1

// Video
const video1 = "videos/Scare video 1.mp4"
const video2 = "videos/Scare video 2.mp4"
const video3 = "videos/Scary_girl.mp4"
const video4 = "videos/horror_scare.mp4"

// Audio
const correctlySpotted = new Audio("audios/click_correct.mp3");
const wronglySpotted = new Audio("audios/Wrong Attempt.wav");
const timeIsUp = new Audio("audios/Time up.mp3");
const correctPasswordAudio = new Audio("audios/The Correct Answer.wav");
const congratulationsButton = new Audio("audios/congratulation.WAV")

// Background music
const backgroundMusic = new Audio("audios/game_ambience.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // normal volume

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

  // video for morse code
  const [showClueVideo, setShowClueVideo] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);

  // video after time eds
  const [overlayVideo, setOverlayVideo] = useState(null); // null or video source
  const [overlayVisible, setOverlayVisible] = useState(false);

  // additional scare video
  const [extraOverlayVideo, setExtraOverlayVideo] = useState(null);
  const clueVideoRef = useRef(null);

  // Helper: play sound effect with ducking
  const playWithDucking = (sound, duckVolume = 0.1, restoreVolume = 0.5) => {
    if (backgroundMusic) {
      backgroundMusic.volume = duckVolume; // lower volume
    }

    sound.currentTime = 0;
    sound.play();

    sound.onended = () => {
      if (backgroundMusic) {
        backgroundMusic.volume = restoreVolume; // restore volume
      }
    };
  };

  useEffect(() => {
    if (showIntro || gameStatus !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          playWithDucking(timeIsUp);
          // wait 2 seconds before playing the clue button sound
          if (attempts === 1) {
            setTimeout(() => {
              setOverlayVideo(video3);
            }, 1800);
          }

          setGameStatus(attempts < attempt + 1 ? 'failed' : 'gameover');
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
      //console.log('[WRONG] Clicked a wrong box at position:', position);
      setTimeLeft(prev => Math.max(prev - wrongAnswer, 0));
      newIndicator('–2s', 'red', position);
      // Play wrong sound
      playWithDucking(wronglySpotted);
      return;
    }

    // Only check if it's correct if not 'wrong'
    const isCorrect = baseBoxes.some(box => box.id === id);

    if (isCorrect && !clickedBoxes.includes(id)) {
      setClickedBoxes(prev => {
        const updated = [...prev, id];
        return updated;
      });
      setTimeLeft(prev => Math.min(prev , TOTAL_TIME));
      // newIndicator('+5s', 'green', position);
      playWithDucking(correctlySpotted);
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
            <li>Note: Wrong click: -2 seconds</li>
            <li>You have {TOTAL_TIME} seconds per attempt.</li>
          </ul>
          <button
            className="start-button"
            onClick={() => {
              resetGame();
              setShowIntro(false);
              backgroundMusic.play(); // start looping music
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
          <div className="top-row-wrapper">
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

              {overlayVideo && (
                <div
                  className="overlay-video"
                  style={{
                    opacity: overlayVisible ? 0.7 : 0,
                    transition: "opacity 1s ease-in-out", // smooth fade
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                >
                  <video
                    id="overlayVideoElement"
                    autoPlay
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onPlay={(e) => {
                      backgroundMusic.pause();
                      setOverlayVisible(true); // fade in
                    }}
                    onTimeUpdate={(e) => {
                      const videoEl = e.currentTarget;
                      if (videoEl.duration && videoEl.currentTime >= videoEl.duration - 1.5) {
                        if (overlayVisible) {
                          setOverlayVisible(false); // fade out
                        }
                      }
                    }}
                    onEnded={() => {
                      setOverlayVideo(null); // remove video after fade
                      backgroundMusic.play();
                    }}
                  >
                    <source src={overlayVideo} type="video/mp4" />
                  </video>
                </div>
              )}
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
                <img
                  src="success.jpeg"
                  alt="You win!"
                  className="success-image"
                  onLoad={() => {
                    playWithDucking(congratulationsButton);
                  }}
                />
              </div>
            )}

            {gameStatus === 'failed' && !showPasswordPrompt && (
              <button
                className="retry-button"
                onClick={() => {
                  setShowPasswordPrompt(true);
                }}
              >
                ⏰ Time’s up! Press here for clue to try again
              </button>
            )}

            { }
            {showPasswordPrompt && (
              <div className="overlay-container">

              <div className="content-stack">
                {/* Clue Video (appears above password prompt, not overlapping) */}
                {showClueVideo && (
                  <div className="clue-video-container" style={{ position: "relative" }}>
                        <video
                          ref={clueVideoRef}
                          id="clueVideo"
                          autoPlay
                          controls={false}
                          playsInline
                          onPlay={() => {
                            backgroundMusic.pause();
                          }}
                          onEnded={() => {
                            setVideoEnded(true);
                            backgroundMusic.currentTime = 0;
                            backgroundMusic.play();
                          }}
                        >
                          <source src={video1} type="video/mp4" />
                        </video>

                        {/* Overlay Video4 */}
                        {extraOverlayVideo && (
                          <div
                            style={{
                              position: "fixed",
                              top: 0,
                              left: 0,
                              width: "100vw",
                              height: "100vh",
                              backgroundColor: "black",
                              zIndex: 9999,
                            }}
                          >
                            <video
                              autoPlay
                              playsInline
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                              onEnded={() => setExtraOverlayVideo(null)}
                            >
                              <source src={video4} type="video/mp4" />
                            </video>
                          </div>
                        )}

                        {videoEnded && (
                          <button
                            className="try-again"
                            onClick={() => {
                              setVideoEnded(false);

                              const video = clueVideoRef.current;

                              if (video) {
                                if (tryAgainAttemptIndex === 1) { 
                                  video.src = video2;
                                  video.load();
                                  video.play();

                                  setTimeout(() => {
                                    setExtraOverlayVideo(video4);
                                  }, 29280);

                                  setTryAgainAttemptIndex(2);
                                } else {
                                  video.src = video1;
                                  video.load();
                                  video.play();
                                  setExtraOverlayVideo(null);
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
                    <p>Enter 4-digit password:</p>
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
                        console.log(correctPassword);
                        if (passwordInput === correctPassword) {
                          const video = document.getElementById("clueVideo");
                          if (video) {
                            video.pause();
                            video.currentTime = 0;
                            setShowClueVideo(false);
                          }

                          playWithDucking(correctPasswordAudio);

                          setPasswordError("correct");
                          setTimeout(() => {
                            setShowPasswordPrompt(false);
                            setGameStatus('won')
                          }, 3000);
                        } else {
                          setPasswordError("wrong");
                          playWithDucking(wronglySpotted);
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
