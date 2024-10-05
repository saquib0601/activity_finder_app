import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css"; // Importing the CSS file for styling

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activities, setActivities] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Use Geolocation API to get the user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError("Unable to retrieve your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.lat || !location.lng) {
      setError("Location is required to sign up.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5002/api/signup", {
        email,
        password,
        activities,
        location,
      });
      if (response.status === 201) {
        navigate("/login");
      }
    } catch (error) {
      setError("Sign up failed. Please try again.");
    }
  };

  const handleActivityChange = (e) => {
    const selected = [...activities];
    if (e.target.checked) {
      if (selected.length < 3) selected.push(e.target.value);
    } else {
      const index = selected.indexOf(e.target.value);
      selected.splice(index, 1);
    }
    setActivities(selected);
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <p className="error-message">{error}</p>}

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

        <div className="activities-section">
          <label>Choose up to 3 activities:</label>
          <div className="activities">
            <label>
              <input
                type="checkbox"
                value="Swimming"
                onChange={handleActivityChange}
                disabled={
                  activities.length >= 3 && !activities.includes("Swimming")
                }
              />{" "}
              Swimming
            </label>
            <label>
              <input
                type="checkbox"
                value="Hiking"
                onChange={handleActivityChange}
                disabled={
                  activities.length >= 3 && !activities.includes("Hiking")
                }
              />{" "}
              Hiking
            </label>
            <label>
              <input
                type="checkbox"
                value="Cricket"
                onChange={handleActivityChange}
                disabled={
                  activities.length >= 3 && !activities.includes("Cricket")
                }
              />{" "}
              Cricket
            </label>
            <label>
              <input
                type="checkbox"
                value="Hockey"
                onChange={handleActivityChange}
                disabled={
                  activities.length >= 3 && !activities.includes("Hockey")
                }
              />{" "}
              Hockey
            </label>
            <label>
              <input
                type="checkbox"
                value="Football"
                onChange={handleActivityChange}
                disabled={
                  activities.length >= 3 && !activities.includes("Football")
                }
              />{" "}
              Football
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
