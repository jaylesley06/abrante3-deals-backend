const express = require('express');
const router = express.Router();
const {
  getDataPlans,
  getDataPlansByNetwork,
  getDataPlan
} = require('../controllers/dataPlanController');

router.get('/', getDataPlans);
router.get('/:network', getDataPlansByNetwork);
router.get('/plan/:id', getDataPlan);

module.exports = router;
