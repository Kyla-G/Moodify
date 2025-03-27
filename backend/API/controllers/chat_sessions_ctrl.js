const { ChatSession } = require('../models');

// Create a new chat session
exports.createChatSession = async (req, res) => {
    try {
        const { user_ID } = req.body;
        const chatSession = await ChatSession.create({
            user_ID,
            start_time: new Date(),
            end_time: new Date() // Placeholder, should be updated when session ends
        });
        res.status(201).json(chatSession);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create chat session' });
    }
};

// Fetch all chat sessions
exports.getAllChatSessions = async (req, res) => {
    try {
        const chatSessions = await ChatSession.findAll();
        res.status(200).json(chatSessions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat sessions' });
    }
};

// Fetch a single chat session by ID
exports.getChatSessionById = async (req, res) => {
    try {
        const { id } = req.params;
        const chatSession = await ChatSession.findByPk(id);
        if (!chatSession) return res.status(404).json({ error: 'Chat session not found' });
        res.status(200).json(chatSession);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat session' });
    }
};

// Update chat session end time
exports.updateChatSession = async (req, res) => {
    try {
        const { id } = req.params;
        const chatSession = await ChatSession.findByPk(id);
        if (!chatSession) return res.status(404).json({ error: 'Chat session not found' });

        chatSession.end_time = new Date();
        await chatSession.save();

        res.status(200).json(chatSession);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update chat session' });
    }
};

// Delete a chat session
exports.deleteChatSession = async (req, res) => {
    try {
        const { id } = req.params;
        const chatSession = await ChatSession.findByPk(id);
        if (!chatSession) return res.status(404).json({ error: 'Chat session not found' });

        await chatSession.destroy();
        res.status(200).json({ message: 'Chat session deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete chat session' });
    }
};
