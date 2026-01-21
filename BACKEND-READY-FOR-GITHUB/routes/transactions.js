const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTransactions);
router.get('/:id', protect, getTransaction);

module.exports = router;
