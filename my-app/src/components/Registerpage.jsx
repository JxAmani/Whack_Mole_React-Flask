import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sha256 } from 'js-sha256'; // Used to hash passwords before sending

function Register() {
  // Manage form data with React state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Runs when user clicks "Register"
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Hash password before sending to backend
      const hashedPassword = sha256(password);

      // Send data to Flask backend
      const res = await fetch('http://127.0.0.1:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password: hashedPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful!');
        navigate('/login'); // Redirect to login page
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };

  // Basic form for registration
  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2>Create Your Character</h2>
      <input
        placeholder="Character Name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        placeholder="Password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button type="submit" style={styles.button}>Register</button>
    </form>
  );
}

// Simple inline styling
const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '300px',
    margin: '100px auto',
    textAlign: 'center',
  },
  input: { padding: '10px', fontSize: '14px' },
  button: { padding: '10px 20px', fontSize: '16px', cursor: 'pointer' },
};

export default Register;
