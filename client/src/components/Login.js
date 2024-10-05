import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setUser } from '../redux/actions';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Importing the CSS file for styling

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post('http://localhost:5002/api/login', { email, password });
      
      const { token, user } = response.data;

      // Store the JWT token and its expiry in localStorage
      // const expiryTime = Date.now() + 10 * 1000; // Token expiration in 10 sec
      const expiryTime = Date.now() + 5 * 60 * 1000; // Token expiration in 5 minutes
      localStorage.setItem('token', token);
      localStorage.setItem('tokenExpiry', expiryTime.toString());

      // Dispatch the user data to Redux store
      dispatch(setUser(user));

      // Redirect to the dashboard after login
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      // Handle login error (e.g., show error message to the user)
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        
        <button type="submit" className="submit-btn">Login</button>
      </form>
    </div>
  );
};

export default Login;
