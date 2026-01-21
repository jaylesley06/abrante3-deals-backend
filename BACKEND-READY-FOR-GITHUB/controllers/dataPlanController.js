const DataPlan = require('../models/DataPlan');

// @desc    Get all data plans
// @route   GET /api/data-plans
// @access  Public
exports.getDataPlans = async (req, res) => {
  try {
    const { network } = req.query;

    let query = { isActive: true };
    if (network) {
      query.network = network;
    }

    const dataPlans = await DataPlan.find(query).sort({ price: 1 });

    res.json({
      success: true,
      count: dataPlans.length,
      data: dataPlans
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

// @desc    Get data plans by network
// @route   GET /api/data-plans/:network
// @access  Public
exports.getDataPlansByNetwork = async (req, res) => {
  try {
    const { network } = req.params;

    const dataPlans = await DataPlan.find({ 
      network: network,
      isActive: true 
    }).sort({ price: 1 });

    res.json({
      success: true,
      count: dataPlans.length,
      data: dataPlans
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

// @desc    Get single data plan
// @route   GET /api/data-plans/plan/:id
// @access  Public
exports.getDataPlan = async (req, res) => {
  try {
    const dataPlan = await DataPlan.findById(req.params.id);

    if (!dataPlan) {
      return res.status(404).json({
        success: false,
        message: 'Data plan not found'
      });
    }

    res.json({
      success: true,
      data: dataPlan
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
