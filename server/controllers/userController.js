const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const { Client } = require('@googlemaps/google-maps-services-js');

dotenv.config();

// Initialize Google Maps Client with API key
const client = new Client({});
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Signup: Adding location and saving user
exports.signup = async (req, res) => {
    const { email, password, activities, location } = req.body;  // location will be an object with lat and lng

    try {
        const newUser = new User({ email, password, activities, location });
        await newUser.save(); // Save the user to the database
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (err) {
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1m' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: 'Login error' });
    }
};

// Get nearby friends using Google Distance Matrix API
exports.getNearbyFriends = async (req, res) => {
    const { userId } = req.query;

    try {
        const user = await User.findById(userId);
        const friends = await User.find({
            _id: { $ne: userId },
            activities: { $in: user.activities }  // Find friends with matching activities
        });

        // Fetch distances using Google Distance Matrix API
        const origins = [`${user.location.lat},${user.location.lng}`];
        const destinations = friends.map(friend => `${friend.location.lat},${friend.location.lng}`);

        const distanceResponse = await client.distancematrix({
            params: {
                origins,
                destinations,
                key: GOOGLE_API_KEY,
            }
        });

        console.log("distanceResponse-data",distanceResponse.data)
        // Ensure that distances are safely accessed
        const distances = distanceResponse.data.rows[0].elements;

        // Combine friends data with distance info
        const friendsWithDistance = friends.map((friend, index) => ({
            ...friend._doc,
            distance: distances[index]?.distance?.text || 'N/A',  // distance in human-readable format
            duration: distances[index]?.duration?.text || 'N/A'   // duration in human-readable format
        }));
        console.log(friendsWithDistance)

        res.json(friendsWithDistance);
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({ error: 'Error fetching friends' });
    }
};
