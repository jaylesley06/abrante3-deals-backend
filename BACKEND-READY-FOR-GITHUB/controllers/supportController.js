const SupportTicket = require('../models/SupportTicket');

// @desc    Create support ticket
// @route   POST /api/support
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const { subject, message } = req.body;

    const ticket = await SupportTicket.create({
      user: req.user._id,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket
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

// @desc    Get user tickets
// @route   GET /api/support
// @access  Private
exports.getTickets = async (req, res) => {
  try {
    const { status } = req.query;

    let query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: tickets.length,
      data: tickets
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

// @desc    Get single ticket
// @route   GET /api/support/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate('user', 'username email');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Make sure ticket belongs to user
    if (ticket.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this ticket'
      });
    }

    res.json({
      success: true,
      data: ticket
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

// @desc    Reply to ticket
// @route   POST /api/support/:id/reply
// @access  Private
exports.replyToTicket = async (req, res) => {
  try {
    const { message } = req.body;

    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Make sure ticket belongs to user or user is admin
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reply to this ticket'
      });
    }

    ticket.replies.push({
      message,
      sender: req.user.role === 'admin' ? 'admin' : 'user',
      senderName: req.user.username
    });

    if (ticket.status === 'closed') {
      ticket.status = 'open';
    }

    await ticket.save();

    res.json({
      success: true,
      message: 'Reply added successfully',
      data: ticket
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

// @desc    Close ticket
// @route   PUT /api/support/:id/close
// @access  Private
exports.closeTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Make sure ticket belongs to user
    if (ticket.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to close this ticket'
      });
    }

    ticket.status = 'closed';
    await ticket.save();

    res.json({
      success: true,
      message: 'Ticket closed successfully',
      data: ticket
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
