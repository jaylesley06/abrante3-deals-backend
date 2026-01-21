const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicket,
  replyToTicket,
  closeTicket
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createTicket);
router.get('/', protect, getTickets);
router.get('/:id', protect, getTicket);
router.post('/:id/reply', protect, replyToTicket);
router.put('/:id/close', protect, closeTicket);

module.exports = router;
