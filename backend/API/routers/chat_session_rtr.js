const express = require('express');
const ChatSessionController = require('../controllers/chat_sessions_ctrl');
const router = express.Router();

// Create a new chat session
router.post('/', ChatSessionController.createChatSession);

// End a chat session
router.put('/:chat_session_ID/end', ChatSessionController.endChatSession);

// Get all chat sessions for a user
router.get('/user/:user_ID', ChatSessionController.getUserChatSessions);

// Get chat sessions by date
router.get('/user/:user_ID/date', ChatSessionController.getChatSessionsByDate);

// Update messages for a chat session
router.put('/:chat_session_ID/messages', ChatSessionController.updateSessionMessages);

// Get active chat session for a user
router.get('/user/:user_ID/active', ChatSessionController.getActiveChatSession);

module.exports = router;