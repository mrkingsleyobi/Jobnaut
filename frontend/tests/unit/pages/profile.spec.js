import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import ProfilePage from '~/pages/profile.vue'

// Create router instance
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div>Home</div>' } },
    { path: '/profile', component: ProfilePage },
    { path: '/jobs', component: { template: '<div>Jobs</div>' } }
  ]
})

describe('ProfilePage', () => {
  beforeEach(async () => {
    // Install router
    router.push('/profile')
    await router.isReady()
  })

  it('renders profile header with user information', () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john.doe@example.com')
    expect(wrapper.text()).toContain('San Francisco, CA')
  })

  it('allows updating profile information', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    // Find name input and change value
    const nameInput = wrapper.find('#name')
    await nameInput.setValue('Jane Smith')

    // Find location input and change value
    const locationInput = wrapper.find('#location')
    await locationInput.setValue('New York, NY')

    // Find bio textarea and change value
    const bioTextarea = wrapper.find('#bio')
    await bioTextarea.setValue('Updated bio information')

    // Click update button
    const updateButton = wrapper.find('.update-button')
    await updateButton.trigger('click')

    // Check that alert was called (in real implementation, this would be an API call)
    // Note: We can't easily test the alert in JSDOM, but we can check that the method was called
    expect(wrapper.vm.profile.name).toBe('Jane Smith')
    expect(wrapper.vm.profile.location).toBe('New York, NY')
    expect(wrapper.vm.profile.bio).toBe('Updated bio information')
  })

  it('allows adding and removing skills', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    // Check initial skills count
    const initialSkillCount = wrapper.vm.profile.skills.length
    expect(wrapper.text()).toContain(`${initialSkillCount} skills`)

    // Add a new skill
    const skillInput = wrapper.find('.skills-input .form-input')
    await skillInput.setValue('Vue.js')

    const addSkillButton = wrapper.find('.add-skill-button')
    await addSkillButton.trigger('click')

    // Check that skill was added
    expect(wrapper.vm.profile.skills).toContain('Vue.js')
    expect(wrapper.text()).toContain(`${initialSkillCount + 1} skills`)

    // Remove a skill
    const removeButtons = wrapper.findAll('.remove-skill-button')
    await removeButtons[0].trigger('click')

    // Check that skill was removed
    expect(wrapper.text()).toContain(`${initialSkillCount} skills`)
  })

  it('allows saving and removing saved jobs', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    // Check initial saved jobs count
    const initialJobCount = wrapper.vm.savedJobs.length
    expect(wrapper.text()).toContain(`${initialJobCount} saved`)

    // Test view job button
    const viewButtons = wrapper.findAll('.view-button')
    if (viewButtons.length > 0) {
      // Mock router push
      const pushSpy = vi.spyOn(router, 'push')

      await viewButtons[0].trigger('click')

      expect(pushSpy).toHaveBeenCalledWith('/jobs/1')

      pushSpy.mockRestore()
    }

    // Test remove job button
    const removeButtons = wrapper.findAll('.remove-button')
    if (removeButtons.length > 0) {
      await removeButtons[0].trigger('click')

      // Check that job was removed
      expect(wrapper.vm.savedJobs.length).toBe(initialJobCount - 1)
      expect(wrapper.text()).toContain(`${initialJobCount - 1} saved`)
    }
  })

  it('allows updating preferences', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    // Toggle email notifications
    const emailNotificationCheckbox = wrapper.find('input[type="checkbox"]')
    const initialEmailValue = wrapper.vm.preferences.emailNotifications

    await emailNotificationCheckbox.setValue(!initialEmailValue)

    // Click save preferences button
    const savePreferencesButton = wrapper.findAll('.update-button')[1]
    await savePreferencesButton.trigger('click')

    // Check that preferences were updated
    expect(wrapper.vm.preferences.emailNotifications).toBe(!initialEmailValue)
  })

  it('shows empty state when no saved jobs', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    // Clear saved jobs
    wrapper.vm.savedJobs = []

    await flushPromises()

    // Check that empty state is displayed
    expect(wrapper.find('.no-saved-jobs').exists()).toBe(true)
    expect(wrapper.text()).toContain("You haven't saved any jobs yet")

    // Test browse jobs link
    const browseJobsLink = wrapper.find('.browse-jobs-link')
    expect(browseJobsLink.exists()).toBe(true)
  })

  it('navigates to jobs page when browse jobs link is clicked', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    // Clear saved jobs to show empty state
    wrapper.vm.savedJobs = []

    await flushPromises()

    const browseJobsLink = wrapper.find('.browse-jobs-link')
    const pushSpy = vi.spyOn(router, 'push')

    await browseJobsLink.trigger('click')

    expect(pushSpy).toHaveBeenCalledWith('/jobs')

    pushSpy.mockRestore()
  })

  it('handles adding skill with Enter key', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    const initialSkillCount = wrapper.vm.profile.skills.length

    // Add a new skill using Enter key
    const skillInput = wrapper.find('.skills-input .form-input')
    await skillInput.setValue('TypeScript')

    await skillInput.trigger('keyup.enter')

    // Check that skill was added
    expect(wrapper.vm.profile.skills).toContain('TypeScript')
    expect(wrapper.vm.profile.skills.length).toBe(initialSkillCount + 1)
  })

  it('prevents adding empty skills', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router]
      }
    })

    const initialSkillCount = wrapper.vm.profile.skills.length

    // Try to add an empty skill
    const skillInput = wrapper.find('.skills-input .form-input')
    await skillInput.setValue('')

    const addSkillButton = wrapper.find('.add-skill-button')
    await addSkillButton.trigger('click')

    // Check that skill count hasn't changed
    expect(wrapper.vm.profile.skills.length).toBe(initialSkillCount)
  })
})