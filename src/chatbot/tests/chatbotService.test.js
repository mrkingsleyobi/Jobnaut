const ChatbotService = require('../../src/chatbot/services/chatbotService');

describe('ChatbotService', () => {
  let chatbotService;

  beforeEach(() => {
    chatbotService = new ChatbotService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(chatbotService).toBeDefined();
  });

  it('should have required methods', () => {
    expect(typeof chatbotService.getConversationHistory).toBe('function');
    expect(typeof chatbotService.saveMessage).toBe('function');
    expect(typeof chatbotService.generateResponse).toBe('function');
    expect(typeof chatbotService.processMessage).toBe('function');
    expect(typeof chatbotService.clearHistory).toBe('function');
  });
});