const express = require('express');
const { signup, login, getNearbyFriends } = require('../controllers/userController');
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/friends', getNearbyFriends);

module.exports = router;
