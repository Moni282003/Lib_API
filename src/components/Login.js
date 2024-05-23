// Login.js
import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Slide from './slide';
import { supabase } from '../util/supabase'; // Assuming you have a supabase client instance
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data, error } = await supabase
        .from('Login')
        .select('*')
        .eq('Username', username)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        setError('User not found');
        alert('User not found')
        return;
      }

      if (data.Password !== password) {
        setError('Incorrect password');
        alert('Incorrect password')
        return;
      }

      navigate(`/dashboard/${data.Name}`);
      alert("Login success")
      setPassword('');
      setUsername('');
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className='BG padding'>    
      <Header />
      <div className="container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input"
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              placeholder="Username"
              required
            />
          </div>
          <div className="form-group">
            <input
              className="input"
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
            />
          </div>
          <button className="button" type="submit">Login</button>
          {error && <p className="error">{error}</p>}
        </form>
        <Slide />
      </div>
      <Footer />
    </div>
  );
}
