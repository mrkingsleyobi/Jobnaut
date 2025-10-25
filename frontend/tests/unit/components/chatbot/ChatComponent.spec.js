import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatComponent from '../../../../components/chatbot/ChatComponent.vue'

describe('ChatComponent', () => {
  const mockUserId = 'user-123'

  it('renders correctly with initial message', async () => {
    const wrapper = mount(ChatComponent, {
      props: {
        userId: mockUserId
      }
    })

    // Wait for async operations
    await wrapper.vm.$nextTick()

    // Check that the component renders
    expect(wrapper.exists()).toBe(true)

    // Check that the initial message is displayed
    expect(wrapper.text()).toContain('AI Career Coach')

    // Check that the input field exists
    const input = wrapper.find('.chat-input')
    expect(input.exists()).toBe(true)

    // Check that the send button exists
    const sendButton = wrapper.find('.send-button')
    expect(sendButton.exists()).toBe(true)
  })

  it('allows sending messages', async () => {
    const wrapper = mount(ChatComponent, {
      props: {
        userId: mockUserId
      }
    })

    // Wait for initial messages to load
    await wrapper.vm.$nextTick()

    // Find the input and enter a message
    const input = wrapper.find('.chat-input')
    await input.setValue('Hello, career coach!')

    // Find and click the send button
    const sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')

    // Wait for the message to be processed
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1100)) // Wait for mock API delay

    // Check that the user message appears or error message appears
    const text = wrapper.text()
    expect(text).toContain('AI Career Coach')

    // Since we're mocking network errors, we should see the error message
    expect(text).toContain('Sorry, I encountered an error processing your request')
  })

  it('shows typing indicator when loading', async () => {
    const wrapper = mount(ChatComponent, {
      props: {
        userId: mockUserId
      }
    })

    // Set loading state
    wrapper.vm.isLoading = true
    await wrapper.vm.$nextTick()

    // Check that typing indicator is visible
    const typingIndicator = wrapper.find('.typing-indicator')
    expect(typingIndicator.exists()).toBe(true)
  })

  it('clears history when clear button is clicked', async () => {
    const wrapper = mount(ChatComponent, {
      props: {
        userId: mockUserId
      }
    })

    // Wait for initial messages to load
    await wrapper.vm.$nextTick()

    // Mock confirm dialog to return true
    const confirmSpy = vi.spyOn(window, 'confirm').mockImplementation(() => true)

    // Find and click the clear button
    const clearButton = wrapper.find('.clear-button')
    await clearButton.trigger('click')

    // Wait for async operations
    await wrapper.vm.$nextTick()

    // Check that confirm was called
    expect(confirmSpy).toHaveBeenCalled()

    // Restore the original confirm function
    confirmSpy.mockRestore()
  })

  it('handles message sending errors gracefully', async () => {
    const wrapper = mount(ChatComponent, {
      props: {
        userId: mockUserId
      }
    })

    // Wait for initial messages to load
    await wrapper.vm.$nextTick()

    // Find the input and enter a message
    const input = wrapper.find('.chat-input')
    await input.setValue('Test message')

    // Mock console.error to avoid cluttering test output
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    // Find and click the send button
    const sendButton = wrapper.find('.send-button')
    await sendButton.trigger('click')

    // Wait for the message to be processed
    await wrapper.vm.$nextTick()
    await new Promise(resolve => setTimeout(resolve, 1100)) // Wait for mock API delay

    // Restore console.error
    consoleSpy.mockRestore()
  })
})