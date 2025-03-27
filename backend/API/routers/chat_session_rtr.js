const express = require('express');
const router = express.Router();
const chatSessionCtrl = require('../controllers/chat_sessions_ctrl');

// Create a new chat session
router.post('/', chatSessionCtrl.createChatSession);

// Retrieve all chat sessions
router.get('/', chatSessionCtrl.getAllChatSessions);

// Retrieve a single chat session by its ID
router.get('/:id', chatSessionCtrl.getChatSessionById);

// Update the end time of a chat session (e.g., when a session ends)
router.put('/:id', chatSessionCtrl.updateChatSession);

// Delete a chat session
router.delete('/:id', chatSessionCtrl.deleteChatSession);

module.exports = router;
