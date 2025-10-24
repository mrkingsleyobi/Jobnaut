const OpenAI = require('openai');
const { PrismaClient } = require('@prisma/client');

class ChatbotService {
  constructor() {
    this.prisma = new PrismaClient();
    this.openai = new OpenAI.OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'your-openai-api-key-here'
    });
  }

  /**
   * Get conversation history for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - Array of conversation messages
   */
  async getConversationHistory(userId) {
    try {
      const history = await this.prisma.chatMessage.findMany({
        where: {
          userId: userId
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
      return history;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw new Error('Failed to fetch conversation history');
    }
  }

  /**
   * Save a message to the conversation history
   * @param {string} userId - The user ID
   * @param {string} role - The role (user or assistant)
   * @param {string} content - The message content
   * @returns {Promise<Object>} - The saved message
   */
  async saveMessage(userId, role, content) {
    try {
      const message = await this.prisma.chatMessage.create({
        data: {
          userId,
          role,
          content
        }
      });
      return message;
    } catch (error) {
      console.error('Error saving message:', error);
      throw new Error('Failed to save message');
    }
  }

  /**
   * Generate a response from the AI
   * @param {Array} messages - Array of messages in the conversation
   * @returns {Promise<string>} - The AI response
   */
  async generateResponse(messages) {
    try {
      // Format messages for OpenAI API
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Add system message to set context
      const systemMessage = {
        role: 'system',
        content: 'You are an AI career coach for JobNaut, a job search platform. Help users with career advice, resume tips, interview preparation, and job search strategies. Be professional, encouraging, and provide actionable advice.'
      };

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [systemMessage, ...formattedMessages],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating AI response:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  /**
   * Process a user message and generate a response
   * @param {string} userId - The user ID
   * @param {string} userMessage - The user's message
   * @returns {Promise<Object>} - Object containing the user message and AI response
   */
  async processMessage(userId, userMessage) {
    try {
      // Save user message
      const savedUserMessage = await this.saveMessage(userId, 'user', userMessage);

      // Get conversation history
      const history = await this.getConversationHistory(userId);

      // Generate AI response
      const aiResponse = await this.generateResponse(history);

      // Save AI response
      const savedAiMessage = await this.saveMessage(userId, 'assistant', aiResponse);

      return {
        userMessage: savedUserMessage,
        aiMessage: savedAiMessage
      };
    } catch (error) {
      console.error('Error processing message:', error);
      throw new Error('Failed to process message');
    }
  }

  /**
   * Clear conversation history for a user
   * @param {string} userId - The user ID
   * @returns {Promise<void>}
   */
  async clearHistory(userId) {
    try {
      await this.prisma.chatMessage.deleteMany({
        where: {
          userId: userId
        }
      });
    } catch (error) {
      console.error('Error clearing conversation history:', error);
      throw new Error('Failed to clear conversation history');
    }
  }
}

module.exports = ChatbotService;