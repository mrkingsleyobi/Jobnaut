const express = require('express');
const { PrismaClient } = require('@prisma/client');
const ChatbotService = require('../chatbot/services/chatbotService');

const router = express.Router();
const prisma = new PrismaClient();
const chatbotService = new ChatbotService();

/**
 * Get conversation history for a user
 * @route GET /api/chat/history/:userId
 * @param {string} userId - The user ID
 * @returns {Array} - Array of conversation messages
 */
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // In a real implementation, you would verify the user is authenticated
    // and authorized to access this conversation history

    const history = await chatbotService.getConversationHistory(userId);

    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation history'
    });
  }
});

/**
 * Send a message to the chatbot
 * @route POST /api/chat/message
 * @param {string} userId - The user ID
 * @param {string} message - The user's message
 * @returns {Object} - The AI response
 */
router.post('/message', async (req, res) => {
  try {
    const { userId, message } = req.body;

    // Validate input
    if (!userId || !message) {
      return res.status(400).json({
        success: false,
        error: 'User ID and message are required'
      });
    }

    // In a real implementation, you would verify the user is authenticated
    // and authorized to send messages

    const result = await chatbotService.processMessage(userId, message);

    res.json({
      success: true,
      data: {
        userMessage: result.userMessage,
        aiMessage: result.aiMessage
      }
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process message'
    });
  }
});

/**
 * Clear conversation history for a user
 * @route DELETE /api/chat/history/:userId
 * @param {string} userId - The user ID
 * @returns {Object} - Success response
 */
router.delete('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // In a real implementation, you would verify the user is authenticated
    // and authorized to clear this conversation history

    await chatbotService.clearHistory(userId);

    res.json({
      success: true,
      message: 'Conversation history cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing conversation history:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear conversation history'
    });
  }
});

module.exports = router;