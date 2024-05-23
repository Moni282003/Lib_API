import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import Slide from './slide';
import { supabase } from '../util/supabase'; // Assuming you have a supabase client instance
import { v4 as uuidv4 } from 'uuid';

// Function to generate a random ID of 6 numbers
const generateRandomID = () => {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Generate random ID
    const id = generateRandomID();

    if (password.length < 6) {
      alert("Password should be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      alert("Password and Confirm Password do not match");
      return;
    }

    // Check if username already exists
    const { data: existingUsernames, error: usernameError } = await supabase
      .from('Login')
      .select('Username')
      .eq('Username', username);

    if (usernameError) {
      console.error('Error checking username:', usernameError.message);
      return;
    }

    if (existingUsernames.length > 0) {
      alert("Username already exists");
      return;
    }

    // Check if name already exists
    const { data: existingNames, error: nameError } = await supabase
      .from('Login')
      .select('Name')
      .eq('Name', name);

    if (nameError) {
      console.error('Error checking name:', nameError.message);
      return;
    }

    if (existingNames.length > 0) {
      alert("Name already exists");
      return;
    }

    try {
      const { data, error } = await supabase.from('Login').insert([
        { 
          id: id,
          Name: name,
          Username: username,
          Password: password,
        },
      ]).select();

      if (error) {
        throw error;
      } else {
        console.log('Data uploaded successfully:', data);
        alert("Registered Successfully")
        setConfirmPassword('');
        setName('');
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error uploading data:', error.message);
    }
  };
  
  return (
    <div className='BG padding2'>    
      <Header />
      <div className="container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              className="input"
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              placeholder="Name"
              required
            />
          </div>
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
          <div className="form-group">
            <input
              className="input"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              placeholder="Confirm Password"
              required
            />
          </div>
          <button className="button" type="submit">Register</button>
        </form>
        <Slide />
      </div>
      <Footer />
    </div>
  );
}
