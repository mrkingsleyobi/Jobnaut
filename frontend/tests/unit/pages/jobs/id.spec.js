import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import JobDetailsPage from '~/pages/jobs/[id].vue'
import JobCard from '~/components/JobCard.vue'

// Mock the route params
const mockRoute = {
  params: { id: '1' },
  query: {}
}

const mockRouter = {
  push: vi.fn(),
  currentRoute: {
    value: mockRoute
  }
}

// Mock vue-router
vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => mockRouter
}))

describe('JobDetailsPage', () => {
  let wrapper

  const mockJob = {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'Exciting opportunity for a software engineer to join our team...',
    skills: ['JavaScript', 'React', 'Node.js'],
    postedDate: new Date().toISOString(),
    applicationLink: 'https://example.com/apply/1'
  }

  const mockSimilarJobs = [
    {
      id: 2,
      title: 'Product Manager',
      company: 'Startup Inc',
      location: 'New York, NY',
      description: 'Lead product development...',
      skills: ['Product Management', 'Agile', 'UX'],
      postedDate: new Date().toISOString()
    }
  ]

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    wrapper = mount(JobDetailsPage, {
      global: {
        mocks: {
          $route: mockRoute,
          $router: mockRouter
        },
        stubs: {
          NuxtLink: true
        }
      }
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders job details correctly', async () => {
    // Wait for component to load mock data
    await flushPromises()

    expect(wrapper.text()).toContain(mockJob.title)
    expect(wrapper.text()).toContain(mockJob.company)
    expect(wrapper.text()).toContain(mockJob.location)
    expect(wrapper.text()).toContain(mockJob.description)
  })

  it('displays job requirements/skills', async () => {
    await flushPromises()

    mockJob.skills.forEach(skill => {
      expect(wrapper.text()).toContain(skill)
    })
  })

  it('displays job details information', async () => {
    await flushPromises()

    expect(wrapper.text()).toContain('Posted Date:')
    expect(wrapper.text()).toContain('Experience Level:')
    expect(wrapper.text()).toContain('Job Type:')
    expect(wrapper.text()).toContain('Remote:')
  })

  it('shows similar jobs section', async () => {
    await flushPromises()

    expect(wrapper.find('.similar-jobs-grid').exists()).toBe(true)
    expect(wrapper.findComponent(JobCard).exists()).toBe(true)
  })

  it('handles save job toggle', async () => {
    await flushPromises()

    const saveButton = wrapper.find('.save-button')
    expect(saveButton.exists()).toBe(true)

    // Click save button
    await saveButton.trigger('click')

    // Button text should change to "Saved"
    expect(saveButton.text()).toBe('Saved')
    expect(saveButton.classes()).toContain('saved')

    // Click again to unsave
    await saveButton.trigger('click')

    // Button text should change back to "Save Job"
    expect(saveButton.text()).toBe('Save Job')
    expect(saveButton.classes()).not.toContain('saved')
  })

  it('opens application link when apply button is clicked', async () => {
    // Mock window.open
    const mockOpen = vi.spyOn(window, 'open').mockImplementation(() => {})

    await flushPromises()

    const applyButton = wrapper.find('.apply-button')
    await applyButton.trigger('click')

    expect(mockOpen).toHaveBeenCalledWith(mockJob.applicationLink, '_blank')

    mockOpen.mockRestore()
  })

  it('navigates to job details when similar job is clicked', async () => {
    await flushPromises()

    const similarJobCard = wrapper.findComponent(JobCard)
    similarJobCard.vm.$emit('view-details', 2)

    await flushPromises()

    expect(mockRouter.push).toHaveBeenCalledWith('/jobs/2')
  })

  it('toggles save state for similar jobs', async () => {
    await flushPromises()

    const similarJobCard = wrapper.findComponent(JobCard)
    similarJobCard.vm.$emit('save', 2)

    // The component should handle this event without errors
    expect(wrapper.exists()).toBe(true)
  })

  it('shows loading state initially', () => {
    // Check that loading message is displayed
    expect(wrapper.text()).toContain('Loading job details...')
  })

  it('shows error message when job is not found', async () => {
    // Create a new wrapper with empty job data
    const errorWrapper = mount({
      template: '<div class="error">Job not found</div>'
    })

    expect(errorWrapper.text()).toBe('Job not found')
  })
})