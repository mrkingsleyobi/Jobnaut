import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import ProfilePage from '../../../pages/profile.vue'

// Mock vue-router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  currentRoute: {
    value: { path: '/profile', params: {}, query: {} }
  },
  isReady: vi.fn().mockResolvedValue()
}

vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRoute: vi.fn(() => ({
      params: {},
      query: {}
    })),
    useRouter: vi.fn(() => mockRouter)
  }
})

const router = mockRouter

// Mock window.alert
window.alert = vi.fn()

describe('ProfilePage', () => {
  beforeEach(async () => {
    // Install router
    router.push('/profile')
    await router.isReady()

    // Clear router mocks
    mockRouter.push.mockClear()
  })

  it('renders profile header with user information', () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
      }
    })

    expect(wrapper.text()).toContain('John Doe')
    expect(wrapper.text()).toContain('john.doe@example.com')
    expect(wrapper.text()).toContain('San Francisco, CA')
  })

  it('allows updating profile information', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
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

    // Check that alert was called
    expect(window.alert).toHaveBeenCalledWith('Profile updated successfully!')

    // Check that the method was called
    expect(wrapper.vm.profile.name).toBe('Jane Smith')
    expect(wrapper.vm.profile.location).toBe('New York, NY')
    expect(wrapper.vm.profile.bio).toBe('Updated bio information')
  })

  it('allows adding and removing skills', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
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
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
      }
    })

    // Check initial saved jobs count
    const initialJobCount = wrapper.vm.savedJobs.length
    expect(wrapper.text()).toContain(`${initialJobCount} saved`)

    // Test view job button
    const viewButtons = wrapper.findAll('.view-button')
    if (viewButtons.length > 0) {
      await viewButtons[0].trigger('click')
      expect(mockRouter.push).toHaveBeenCalledWith('/jobs/1')
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
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
      }
    })

    // Toggle email notifications
    const emailNotificationCheckbox = wrapper.find('input[type="checkbox"]')
    const initialEmailValue = wrapper.vm.preferences.emailNotifications

    await emailNotificationCheckbox.setValue(!initialEmailValue)

    // Click save preferences button
    const savePreferencesButton = wrapper.findAll('.update-button')[1]
    await savePreferencesButton.trigger('click')

    // Check that alert was called
    expect(window.alert).toHaveBeenCalledWith('Preferences saved successfully!')

    // Check that preferences were updated
    expect(wrapper.vm.preferences.emailNotifications).toBe(!initialEmailValue)
  })

  it('shows empty state when no saved jobs', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
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
        plugins: [router],
        stubs: {
          NuxtLink: {
            template: '<a href="/jobs" @click.prevent="() => router.push(\'/jobs\')"><slot /></a>',
            setup() {
              return { router: mockRouter }
            }
          }
        }
      }
    })

    // Clear saved jobs to show empty state
    wrapper.vm.savedJobs = []

    await flushPromises()

    const browseJobsLink = wrapper.find('.browse-jobs-link')
    await browseJobsLink.trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith('/jobs')
  })

  it('handles adding skill with Enter key', async () => {
    const wrapper = mount(ProfilePage, {
      global: {
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
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
        plugins: [router],
        stubs: {
          NuxtLink: true
        }
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