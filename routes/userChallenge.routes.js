const express = require('express');
const router = express.Router();
const {
  getUserChallenges,
  getUserChallenge,
  startChallenge,
  updateChallengeProgress,
  deleteUserChallenge
} = require('../controllers/userChallengeController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected and require authentication
router.use(protect);

// @desc    Get all user challenges
// @route   GET /api/user-challenges
router.route('/')
  .get(getUserChallenges)
  .post(startChallenge);

// @desc    Get single user challenge
// @route   GET /api/user-challenges/:id
router.route('/:id')
  .get(getUserChallenge)
  .delete(deleteUserChallenge);

// @desc    Update challenge progress
// @route   PUT /api/user-challenges/:id/progress
router.route('/:id/progress')
  .put(updateChallengeProgress);

module.exports = router;