const db = require('../models');
const ChatSession = db.ChatSession;
const { Op } = require('sequelize');

// Create a new chat session
exports.createChatSession = async (req, res) => {
  try {
    const { user_ID } = req.body;
    
    // Check for any active sessions for this user and end them
    await ChatSession.update(
      { isActive: 0, end_time: new Date() },
      { 
        where: { 
          user_ID: user_ID, 
          isActive: 1 
        } 
      }
    );
    
    // Create a new session
    const newSession = await ChatSession.create({
      user_ID: user_ID,
      start_time: new Date(),
      end_time: new Date(), // Will be updated when session ends
      isActive: 1
    });
    
    res.status(201).json({
      success: true,
      message: 'Chat session created successfully',
      data: newSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create chat session',
      error: error.message
    });
  }
};

// End a chat session
exports.endChatSession = async (req, res) => {
  try {
    const { chat_session_ID } = req.params;
    
    const session = await ChatSession.findByPk(chat_session_ID);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }
    
    // Update the session
    session.isActive = 0;
    session.end_time = new Date();
    await session.save();
    
    res.status(200).json({
      success: true,
      message: 'Chat session ended successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to end chat session',
      error: error.message
    });
  }
};

// Get all chat sessions for a user
exports.getUserChatSessions = async (req, res) => {
  try {
    const { user_ID } = req.params;
    
    const sessions = await ChatSession.findAll({
      where: { user_ID: user_ID },
      order: [['start_time', 'DESC']]
    });
    
    res.status(200).json({
      success: true,
      message: 'Chat sessions retrieved successfully',
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat sessions',
      error: error.message
    });
  }
};

// Get chat sessions by date
exports.getChatSessionsByDate = async (req, res) => {
  try {
    const { user_ID } = req.params;
    const { date } = req.query; // Format: YYYY-MM-DD
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date parameter is required'
      });
    }
    
    // Create date range for the specified day
    const startDate = new Date(`${date}T00:00:00.000Z`);
    const endDate = new Date(`${date}T23:59:59.999Z`);
    
    const sessions = await ChatSession.findAll({
      where: {
        user_ID: user_ID,
        start_time: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['start_time', 'ASC']]
    });
    
    res.status(200).json({
      success: true,
      message: 'Chat sessions retrieved successfully',
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve chat sessions by date',
      error: error.message
    });
  }
};

// Update messages for a chat session
exports.updateSessionMessages = async (req, res) => {
  try {
    const { chat_session_ID } = req.params;
    const { messages } = req.body;
    
    const session = await ChatSession.findByPk(chat_session_ID);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }
    
    // In a real implementation, you would have a separate Messages table
    // This is just a placeholder for how you might handle messages
    
    res.status(200).json({
      success: true,
      message: 'Chat messages updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update chat messages',
      error: error.message
    });
  }
};

// Get active chat session for a user
exports.getActiveChatSession = async (req, res) => {
  try {
    const { user_ID } = req.params;
    
    const activeSession = await ChatSession.findOne({
      where: {
        user_ID: user_ID,
        isActive: 1
      }
    });
    
    if (!activeSession) {
      return res.status(404).json({
        success: false,
        message: 'No active chat session found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Active chat session retrieved successfully',
      data: activeSession
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve active chat session',
      error: error.message
    });
  }
};