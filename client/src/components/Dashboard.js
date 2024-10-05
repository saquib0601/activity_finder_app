import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './Dashboard.css';  // Import the CSS file for styling
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../redux/actions';

const Dashboard = () => {
  const user = useSelector((state) => state.user);
  const [friends, setFriends] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();


  useEffect(() => {
    console.log(user)
    // Function to check token expiration
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('token');
      const tokenExpiry = localStorage.getItem('tokenExpiry'); // Save token expiry time in localStorage
      const parsedExpiry = parseInt(tokenExpiry, 10); // Parse tokenExpiry as a number

      console.log('Token:', token);
      console.log('Token Expiry:', tokenExpiry);
      console.log('Date Now:', Date.now());

      if (!token || Date.now() > parsedExpiry) {
        console.log('Token expired or missing, redirecting to login');
        // If token is invalid or expired, log the user out and redirect to login
        dispatch(clearUser());
        navigate('/login');
        return;
      }
    };

    // Check immediately when component mounts
    checkTokenExpiration();

    // Set interval to check token expiration every second (1000ms)
    const intervalId = setInterval(() => {
      checkTokenExpiration();
    }, 300000);

    // Fetch friends data if token is valid
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5002/api/friends?userId=${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFriends(response.data);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();

    // Cleanup the interval when the component unmounts
    return () => {
      clearInterval(intervalId);
    };
  }, [user, dispatch, navigate]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Nearby Friends</h2>
      <div className="friends-list">
        {friends.map((friend) => (
          <div key={friend._id} className="friend-card">
            <p className="friend-email">{friend.email}</p>
            <p className="friend-activities">{friend.activities.join(', ')}</p>
            <p className="friend-distance">Distance: {friend.distance}</p>
            <p className="friend-duration">Duration: {friend.duration}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
