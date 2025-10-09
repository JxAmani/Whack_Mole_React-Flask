import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

import Hole from '../assets/Hole.jpeg';
import moleImg from '../assets/mole.png';
import bombImg from '../assets/Bomb.png';
import whackMusic from '../assets/whack.mp3';

function Game() {
  const [moles, setMoles] = useState(new Array(9).fill(false));
  const [bombs, setBombs] = useState(new Array(9).fill(false));
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [player, setPlayer] = useState(null);
  const [level, setLevel] = useState(1);

  const navigate = useNavigate();
  const audioRef = useRef(null);
  const moleIntervalRef = useRef(null);

  const levelSpeed = {
    1: 1000,
    2: 800,
    3: 600,
    4: 400
  };

  // Load user & progress from sessionStorage
  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPlayer(user);
      setHighScore(user.highscore || 0);

      const savedScore = sessionStorage.getItem('currentScore');
      const savedLevel = sessionStorage.getItem('currentLevel');
      if (savedScore) setScore(Number(savedScore));
      if (savedLevel) setLevel(Number(savedLevel));
    } else {
      alert('You must be logged in to play!');
      navigate('/login');
    }
  }, [navigate]);

  // Play/pause background music
  useEffect(() => {
    if (audioRef.current) {
      gameOver ? audioRef.current.pause() : audioRef.current.play();
    }
  }, [gameOver]);

  // Mole + Bomb interval
  useEffect(() => {
    if (gameOver) return;
    clearInterval(moleIntervalRef.current);

    moleIntervalRef.current = setInterval(() => {
      // Mole
      const moleIndex = Math.floor(Math.random() * 9);
      const newMoles = new Array(9).fill(false);
      newMoles[moleIndex] = true;
      setMoles(newMoles);

      // Bomb (level >= 3) — ensure it doesn't overlap mole
      if (level >= 3) {
        let bombIndex;
        do {
          bombIndex = Math.floor(Math.random() * 9);
        } while (bombIndex === moleIndex); // prevent overlap
        const newBombs = new Array(9).fill(false);
        newBombs[bombIndex] = true;
        setBombs(newBombs);
      } else {
        setBombs(new Array(9).fill(false));
      }
    }, levelSpeed[level]);

    return () => clearInterval(moleIntervalRef.current);
  }, [level, gameOver]);

  // Timer countdown
  useEffect(() => {
    if (gameOver) return;
    const timerId = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [gameOver]);

  // Update level based on score & save progress
  useEffect(() => {
    let nextLevel = 1;
    if (score >= 400) nextLevel = 4;
    else if (score >= 300) nextLevel = 3;
    else if (score >= 200) nextLevel = 2;
    setLevel(nextLevel);

    sessionStorage.setItem('currentScore', score);
    sessionStorage.setItem('currentLevel', nextLevel);
  }, [score]);

  // Save highscore on game over
  useEffect(() => {
    if (gameOver) saveHighscore();
  }, [gameOver]);

  const handleMoleClick = (index) => {
    if (moles[index] && !gameOver) {
      setScore(prev => prev + 20);
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
    }
  };

  const handleBombClick = (index) => {
    if (bombs[index] && !gameOver) {
      setScore(prev => Math.max(0, prev - 50));
      const newBombs = [...bombs];
      newBombs[index] = false;
      setBombs(newBombs);
    }
  };

  const saveHighscore = async () => {
    if (!player || !player.id) return;
    if (score > highScore) {
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/update-score/${player.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ highscore: score }),
        });
        const data = await res.json();
        if (res.ok) {
          setHighScore(data.highscore);
          const updatedPlayer = { ...player, highscore: data.highscore };
          setPlayer(updatedPlayer);
          sessionStorage.setItem('loggedInUser', JSON.stringify(updatedPlayer));
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePlayAgain = (restartLevel = 1) => {
    setScore(restartLevel === 1 ? 0 : score);
    setTimer(30);
    setGameOver(false);
    setMoles(new Array(9).fill(false));
    setBombs(new Array(9).fill(false));
    if (restartLevel !== 1) setLevel(restartLevel);
  };

  return (
    <div className="game-container" style={{ position: 'relative' }}>
      <audio ref={audioRef} src={whackMusic} loop autoPlay />

      <div style={{
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '12px',
        backgroundColor: '#111',
        color: '#00ff90',
        padding: '10px 14px',
        borderRadius: '8px',
        boxShadow: '0 0 8px rgba(0, 255, 100, 0.5)',
        display: 'inline-block',
        marginBottom: '10px',
        marginTop: '10px'
      }}>
        🎮 Player: {player?.name} | Level: {level}
      </div>

      <div className="status-bar" style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
        <div className="timer" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          padding: '8px 12px',
          backgroundColor: '#ffd700',
          borderRadius: '8px',
          color: '#333',
          userSelect: 'none'
        }}>
          ⏳ Time Left: {timer}s
        </div>
        <div className="score" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          padding: '8px 12px',
          backgroundColor: '#ffd700',
          borderRadius: '8px',
          color: '#333',
          userSelect: 'none'
        }}>
          🏆 Score: {score}
        </div>
        <div className="high-score" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          padding: '8px 12px',
          backgroundColor: '#ffd700',
          borderRadius: '8px',
          color: '#333',
          userSelect: 'none'
        }}>
          🥇 High Score: {highScore}
        </div>
      </div>

      <div className="grid">
        {moles.map((isMole, index) => {
          const isBomb = bombs[index];
          return (
            <img
              key={index}
              src={isMole ? moleImg : isBomb ? bombImg : Hole}
              alt={isMole ? "Mole" : isBomb ? "Bomb" : "Hole"}
              className="grid-cell"
              onClick={() => {
                if (isMole) handleMoleClick(index);
                else if (isBomb) handleBombClick(index);
              }}
            />
          );
        })}
      </div>

      {gameOver && (
        <div className="game-over-modal">
          GAME OVER!
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => handlePlayAgain()}>Play Again (Level 1)</button>
            {level > 1 && (
              <button onClick={() => handlePlayAgain(level)} style={{ marginLeft: '10px' }}>
                Restart Level {level}
              </button>
            )}
            <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;