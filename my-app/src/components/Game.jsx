import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

import Hole from '../assets/Hole.jpeg';
import mole from '../assets/mole.png';
import whackMusic from '../assets/whack.mp3';

function Game() {
  const [moles, setMoles] = useState(new Array(9).fill(false));
  const [timer, setTimer] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [player, setPlayer] = useState(null);

  const navigate = useNavigate();
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      gameOver ? audioRef.current.pause() : audioRef.current.play();
    }
  }, [gameOver]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setPlayer(user);
      setHighScore(user.highscore || 0);
    } else {
      alert('You must be logged in to play!');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * moles.length);
      const newMoles = new Array(9).fill(false);
      newMoles[randomIndex] = true;
      setMoles(newMoles);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  useEffect(() => {
    if (timer <= 0) {
      setGameOver(true);
      setMoles(new Array(9).fill(false));
      return;
    }
    const timerId = setInterval(() => setTimer(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timer]);

  //save high score when game ends
  useEffect(() => {
    if (gameOver) {
      saveHighscore();
    }
  }, [gameOver]);

  const handleMoleClick = (index) => {
    if (moles[index] && !gameOver) {
      setScore(prev => prev + 20);
      const newMoles = [...moles];
      newMoles[index] = false;
      setMoles(newMoles);
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

  const handlePlayAgain = () => {
    setScore(0);
    setTimer(30);
    setGameOver(false);
    setMoles(new Array(9).fill(false));
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
        🎮 Player: {player?.name}
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
        {moles.map((isMole, index) => (
          <img
            key={index}
            src={isMole ? mole : Hole}
            alt={isMole ? "Mole" : "Hole"}
            className="grid-cell"
            onClick={() => handleMoleClick(index)}
          />
        ))}
      </div>

      {gameOver && (
        <div className="game-over-modal">
          GAME OVER!
          <div>
            <button onClick={handlePlayAgain}>Play Again</button>
            <button onClick={() => navigate('/')} style={{ marginLeft: '10px' }}>Home</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Game;