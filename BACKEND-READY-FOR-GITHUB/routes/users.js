const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addFunds,
  getWallet,
  getReferralStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/add-funds', protect, addFunds);
router.get('/wallet', protect, getWallet);
router.get('/referrals', protect, getReferralStats);

module.exports = router;
