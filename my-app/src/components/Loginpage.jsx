import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sha256 } from 'js-sha256';

function Login() {
  const [characterName, setCharacterName] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('loggedInUser');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!characterName || !password) {
      alert('Please enter both character name and password.');
      return;
    }

    try {
      const hashedPassword = sha256(password);
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: characterName, password: hashedPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        sessionStorage.setItem('loggedInUser', JSON.stringify(data));
        setLoggedInUser(data);
        alert('Logged in successfully!');
        navigate('/game');
      } else {
        alert(data.error || 'Invalid character name or password.');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div style={styles.container}>
      <h2>Login Page</h2>
      {loggedInUser ? (
        <div>
          <p>Welcome back, {loggedInUser.name}!</p>
          <button style={styles.button} onClick={() => navigate('/game')}>Go to Game</button>
          <button style={styles.button} onClick={handleBack}>Back</button>
        </div>
      ) : (
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="text"
            placeholder="Character Name"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.button}>Login</button>
            <button type="button" style={styles.button} onClick={handleBack}>Back</button>
          </div>
        </form>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: '100px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    width: '250px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Login;
