const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { username, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    if (user) {
      user.username = username || user.username;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Add funds to wallet
// @route   POST /api/users/add-funds
// @access  Private
exports.addFunds = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }

    const user = await User.findById(req.user._id);

    const balanceBefore = user.walletBalance;
    user.walletBalance += parseFloat(amount);
    const balanceAfter = user.walletBalance;

    await user.save();

    // Create transaction record
    await Transaction.create({
      user: user._id,
      type: 'credit',
      amount: parseFloat(amount),
      description: 'Wallet top-up',
      balanceBefore,
      balanceAfter
    });

    res.json({
      success: true,
      message: 'Funds added successfully',
      data: {
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get wallet balance
// @route   GET /api/users/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        walletBalance: user.walletBalance
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get referral stats
// @route   GET /api/users/referrals
// @access  Private
exports.getReferralStats = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const referredUsers = await User.find({ referredBy: user._id });

    res.json({
      success: true,
      data: {
        referralCode: user.referralCode,
        totalReferrals: referredUsers.length,
        totalEarnings: user.totalEarnings,
        referredUsers: referredUsers.map(u => ({
          username: u.username,
          createdAt: u.createdAt
        }))
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
