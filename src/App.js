// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import Dashboard from './components/Dash';
import Logout from './components/Logout';
import Login from './components/Login';
import Register from './components/Register';
import './App.css'; // Import the CSS file



const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/dashboard/:username" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
