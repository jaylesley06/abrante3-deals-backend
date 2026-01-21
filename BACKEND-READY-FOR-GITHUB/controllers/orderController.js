const Order = require('../models/Order');
const DataPlan = require('../models/DataPlan');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res) => {
  try {
    const { dataPlanId, phoneNumber } = req.body;

    // Get data plan
    const dataPlan = await DataPlan.findById(dataPlanId);

    if (!dataPlan) {
      return res.status(404).json({
        success: false,
        message: 'Data plan not found'
      });
    }

    // Get user
    const user = await User.findById(req.user._id);

    // Check if user has sufficient balance
    if (user.walletBalance < dataPlan.price) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient wallet balance'
      });
    }

    // Create order
    const order = await Order.create({
      user: user._id,
      network: dataPlan.network,
      dataPlan: dataPlan._id,
      phoneNumber,
      dataAmount: dataPlan.dataAmount,
      price: dataPlan.price,
      status: 'processing'
    });

    // Deduct from wallet
    const balanceBefore = user.walletBalance;
    user.walletBalance -= dataPlan.price;
    const balanceAfter = user.walletBalance;
    await user.save();

    // Create transaction record
    await Transaction.create({
      user: user._id,
      type: 'debit',
      amount: dataPlan.price,
      description: `Data purchase - ${dataPlan.dataAmount} ${dataPlan.network}`,
      balanceBefore,
      balanceAfter,
      relatedOrder: order._id
    });

    // Handle referral commission (5% commission)
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const commission = dataPlan.price * 0.05;
        const referrerBalanceBefore = referrer.walletBalance;
        referrer.walletBalance += commission;
        referrer.totalEarnings += commission;
        await referrer.save();

        // Create commission transaction
        await Transaction.create({
          user: referrer._id,
          type: 'commission',
          amount: commission,
          description: `Referral commission from ${user.username}`,
          balanceBefore: referrerBalanceBefore,
          balanceAfter: referrer.walletBalance,
          relatedOrder: order._id
        });
      }
    }

    // Simulate order completion (in production, this would be handled by actual API integration)
    setTimeout(async () => {
      order.status = 'completed';
      await order.save();
    }, 2000);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
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

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { status, network } = req.query;

    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (network) {
      query.network = network;
    }

    const orders = await Order.find(query)
      .populate('dataPlan')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders
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

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('dataPlan')
      .populate('user', 'username email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Make sure order belongs to user
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
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
