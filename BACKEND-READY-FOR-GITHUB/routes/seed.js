const express = require('express');
const router = express.Router();
const User = require('../models/User');
const DataPlan = require('../models/DataPlan');
const bcrypt = require('bcryptjs');

// @route   GET /api/seed
// @desc    Seed database with initial data
// @access  Public (remove this route after seeding!)
router.get('/', async (req, res) => {
  try {
    // Check if already seeded
    const existingPlans = await DataPlan.countDocuments();
    if (existingPlans > 0) {
      return res.json({
        success: false,
        message: 'Database already seeded! Delete this route for security.'
      });
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123456', 10);
    
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@abrante3deals.com',
      password: hashedPassword,
      phoneNumber: '0200000000',
      role: 'admin',
      walletBalance: 1000,
      referralCode: 'ADMIN' + Math.random().toString(36).substring(2, 8).toUpperCase()
    });

    // MTN Data Plans
    const mtnPlans = [
      { network: 'MTN', dataAmount: '1GB', price: 7, validity: '30 days' },
      { network: 'MTN', dataAmount: '2GB', price: 12.50, validity: '30 days' },
      { network: 'MTN', dataAmount: '3GB', price: 17, validity: '30 days' },
      { network: 'MTN', dataAmount: '4GB', price: 23, validity: '30 days' },
      { network: 'MTN', dataAmount: '5GB', price: 29, validity: '30 days' },
      { network: 'MTN', dataAmount: '6GB', price: 33, validity: '30 days' },
      { network: 'MTN', dataAmount: '7GB', price: 37, validity: '30 days' },
      { network: 'MTN', dataAmount: '8GB', price: 42, validity: '30 days' },
      { network: 'MTN', dataAmount: '9GB', price: 47, validity: '30 days' },
      { network: 'MTN', dataAmount: '10GB', price: 52, validity: '30 days' },
      { network: 'MTN', dataAmount: '12GB', price: 65, validity: '30 days' },
      { network: 'MTN', dataAmount: '15GB', price: 78, validity: '30 days' },
      { network: 'MTN', dataAmount: '20GB', price: 95, validity: '30 days' },
      { network: 'MTN', dataAmount: '25GB', price: 115, validity: '30 days' },
      { network: 'MTN', dataAmount: '30GB', price: 133, validity: '30 days' },
      { network: 'MTN', dataAmount: '40GB', price: 172, validity: '30 days' },
      { network: 'MTN', dataAmount: '50GB', price: 212, validity: '30 days' },
      { network: 'MTN', dataAmount: '100GB', price: 410, validity: '30 days' }
    ];

    // AirtelTigo Data Plans
    const airtelTigoPlans = [
      { network: 'AirtelTigo', dataAmount: '1GB', price: 6, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '2GB', price: 11, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '3GB', price: 16, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '4GB', price: 20, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '5GB', price: 25, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '6GB', price: 30, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '7GB', price: 35, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '8GB', price: 39, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '10GB', price: 45, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '12GB', price: 57, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '15GB', price: 66, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '20GB', price: 80, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '25GB', price: 100, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '30GB', price: 125, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '40GB', price: 135, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '50GB', price: 155, validity: '30 days' },
      { network: 'AirtelTigo', dataAmount: '100GB', price: 262, validity: '30 days' }
    ];

    // Telecel Data Plans
    const telecelPlans = [
      { network: 'Telecel', dataAmount: '5GB', price: 25, validity: '30 days' },
      { network: 'Telecel', dataAmount: '10GB', price: 47, validity: '30 days' },
      { network: 'Telecel', dataAmount: '15GB', price: 65, validity: '30 days' },
      { network: 'Telecel', dataAmount: '20GB', price: 87, validity: '30 days' },
      { network: 'Telecel', dataAmount: '25GB', price: 110, validity: '30 days' },
      { network: 'Telecel', dataAmount: '30GB', price: 125, validity: '30 days' },
      { network: 'Telecel', dataAmount: '35GB', price: 145, validity: '30 days' },
      { network: 'Telecel', dataAmount: '40GB', price: 162, validity: '30 days' },
      { network: 'Telecel', dataAmount: '45GB', price: 185, validity: '30 days' },
      { network: 'Telecel', dataAmount: '50GB', price: 210, validity: '30 days' },
      { network: 'Telecel', dataAmount: '100GB', price: 390, validity: '30 days' }
    ];

    // Insert all plans
    const allPlans = [...mtnPlans, ...airtelTigoPlans, ...telecelPlans];
    await DataPlan.insertMany(allPlans);

    res.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        adminUser: {
          email: 'admin@abrante3deals.com',
          password: 'admin123456',
          walletBalance: 1000
        },
        dataPlans: {
          MTN: mtnPlans.length,
          AirtelTigo: airtelTigoPlans.length,
          Telecel: telecelPlans.length,
          total: allPlans.length
        }
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: 'Error seeding database',
      error: error.message
    });
  }
});

module.exports = router;
