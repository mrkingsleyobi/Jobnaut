const { PrismaClient } = require('@prisma/client');
const OpenAI = require('openai');

// Mock PrismaClient
const mockPrisma = {
  chatMessage: {
    findMany: jest.fn(),
    create: jest.fn(),
    deleteMany: jest.fn()
  }
};

// Mock OpenAI
const mockOpenAI = {
  chat: {
    completions: {
      create: jest.fn()
    }
  }
};

// Mock the modules before importing
jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn(() => mockPrisma)
  };
});

jest.mock('openai', () => {
  return {
    OpenAI: jest.fn(() => mockOpenAI)
  };
});

const ChatbotService = require('../../src/chatbot/services/chatbotService');

describe('ChatbotService', () => {
  let chatbotService;
  let mockPrismaClient;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a new instance of the service
    chatbotService = new ChatbotService();
    mockPrismaClient = chatbotService.prisma;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with Prisma client and OpenAI client', () => {
    expect(chatbotService).toBeDefined();
    expect(chatbotService.prisma).toBeDefined();
    expect(chatbotService.openai).toBeDefined();
  });

  it('should fetch conversation history for a user', async () => {
    const userId = 1;
    const mockHistory = [
      { id: 1, userId, role: 'user', content: 'Hello', createdAt: new Date() },
      { id: 2, userId, role: 'assistant', content: 'Hi there!', createdAt: new Date() }
    ];

    mockPrismaClient.chatMessage.findMany.mockResolvedValue(mockHistory);

    const result = await chatbotService.getConversationHistory(userId);

    expect(mockPrismaClient.chatMessage.findMany).toHaveBeenCalledWith({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });
    expect(result).toEqual(mockHistory);
  });

  it('should save a message to the conversation history', async () => {
    const userId = 1;
    const role = 'user';
    const content = 'Hello';
    const mockMessage = { id: 1, userId, role, content, createdAt: new Date() };

    mockPrismaClient.chatMessage.create.mockResolvedValue(mockMessage);

    const result = await chatbotService.saveMessage(userId, role, content);

    expect(mockPrismaClient.chatMessage.create).toHaveBeenCalledWith({
      data: { userId, role, content }
    });
    expect(result).toEqual(mockMessage);
  });

  it('should generate a response from the AI', async () => {
    const messages = [
      { role: 'user', content: 'Hello' }
    ];
    const mockResponse = {
      choices: [{
        message: {
          content: 'Hi there! How can I help you today?'
        }
      }]
    };

    mockOpenAI.chat.completions.create.mockResolvedValue(mockResponse);

    const result = await chatbotService.generateResponse(messages);

    expect(mockOpenAI.chat.completions.create).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an AI career coach for JobNaut, a job search platform. Help users with career advice, resume tips, interview preparation, and job search strategies. Be professional, encouraging, and provide actionable advice.'
        },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.7
    });
    expect(result).toBe('Hi there! How can I help you today?');
  });

  it('should process a user message and generate a response', async () => {
    const userId = 1;
    const userMessage = 'Hello';
    const mockUserMessage = { id: 1, userId, role: 'user', content: userMessage, createdAt: new Date() };
    const mockAiMessage = { id: 2, userId, role: 'assistant', content: 'Hi there!', createdAt: new Date() };
    const mockHistory = [mockUserMessage];

    // Mock the methods
    mockPrismaClient.chatMessage.create.mockImplementation(async (data) => {
      if (data.data.role === 'user') {
        return mockUserMessage;
      } else {
        return mockAiMessage;
      }
    });

    mockPrismaClient.chatMessage.findMany.mockResolvedValue(mockHistory);
    mockOpenAI.chat.completions.create.mockResolvedValue({
      choices: [{
        message: {
          content: 'Hi there!'
        }
      }]
    });

    const result = await chatbotService.processMessage(userId, userMessage);

    expect(result.userMessage).toEqual(mockUserMessage);
    expect(result.aiMessage).toEqual(mockAiMessage);
  });

  it('should clear conversation history for a user', async () => {
    const userId = 1;

    await chatbotService.clearHistory(userId);

    expect(mockPrismaClient.chatMessage.deleteMany).toHaveBeenCalledWith({
      where: { userId }
    });
  });

  it('should handle errors when fetching conversation history', async () => {
    const userId = 1;
    const errorMessage = 'Database error';

    mockPrismaClient.chatMessage.findMany.mockRejectedValue(new Error(errorMessage));

    await expect(chatbotService.getConversationHistory(userId))
      .rejects
      .toThrow('Failed to fetch conversation history');
  });

  it('should handle errors when saving a message', async () => {
    const userId = 1;
    const role = 'user';
    const content = 'Hello';
    const errorMessage = 'Database error';

    mockPrismaClient.chatMessage.create.mockRejectedValue(new Error(errorMessage));

    await expect(chatbotService.saveMessage(userId, role, content))
      .rejects
      .toThrow('Failed to save message');
  });

  it('should handle errors when generating AI response', async () => {
    const messages = [{ role: 'user', content: 'Hello' }];
    const errorMessage = 'OpenAI API error';

    mockOpenAI.chat.completions.create.mockRejectedValue(new Error(errorMessage));

    await expect(chatbotService.generateResponse(messages))
      .rejects
      .toThrow('Failed to generate AI response');
  });
});