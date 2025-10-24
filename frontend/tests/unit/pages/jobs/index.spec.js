import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import JobsPage from '~/pages/jobs/index.vue'
import JobSearch from '~/components/JobSearch.vue'
import JobCard from '~/components/JobCard.vue'

// Mock the search service
const mockSearchService = {
  searchJobs: vi.fn()
}

// Mock search service module
vi.mock('~/services/searchService', () => ({
  default: mockSearchService
}))

// Create router instance
const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: JobsPage },
    { path: '/jobs/:id', component: { template: '<div>Job Details</div>' } }
  ]
})

describe('JobsPage', () => {
  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock search service response
    mockSearchService.searchJobs.mockResolvedValue({
      jobs: [
        {
          id: 1,
          title: 'Software Engineer',
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          description: 'Exciting opportunity...',
          skills: ['JavaScript', 'React'],
          postedDate: new Date().toISOString()
        }
      ],
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1
    })

    // Install router
    router.push('/')
    await router.isReady()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders job search component', () => {
    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    expect(wrapper.findComponent(JobSearch).exists()).toBe(true)
  })

  it('renders job cards for search results', async () => {
    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.findComponent(JobCard).exists()).toBe(true)
    expect(wrapper.text()).toContain('Software Engineer')
  })

  it('shows loading state while fetching jobs', async () => {
    // Mock search service to take some time
    mockSearchService.searchJobs.mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({
            jobs: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
          })
        }, 100)
      })
    })

    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    // Should show loading initially
    expect(wrapper.text()).toContain('Loading jobs...')

    await flushPromises()

    // Should show no results after loading
    expect(wrapper.text()).toContain('No jobs found')
  })

  it('handles search events from JobSearch component', async () => {
    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for initial load
    await flushPromises()

    // Emit search event from JobSearch component
    const jobSearch = wrapper.findComponent(JobSearch)
    jobSearch.vm.$emit('search', {
      query: 'developer',
      location: 'remote',
      experience: 'mid',
      jobType: 'full-time'
    })

    await flushPromises()

    // Check that search service was called with correct params
    expect(mockSearchService.searchJobs).toHaveBeenCalledWith({
      query: 'developer',
      location: 'remote',
      experience: 'mid',
      jobType: 'full-time',
      page: 1,
      limit: 10
    })
  })

  it('handles clear filters events from JobSearch component', async () => {
    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    // Wait for initial load
    await flushPromises()

    // Reset mock to track new calls
    mockSearchService.searchJobs.mockClear()

    // Emit clear filters event from JobSearch component
    const jobSearch = wrapper.findComponent(JobSearch)
    jobSearch.vm.$emit('clear-filters')

    await flushPromises()

    // Check that search service was called again (to reload all jobs)
    expect(mockSearchService.searchJobs).toHaveBeenCalled()
  })

  it('handles pagination', async () => {
    // Mock search service to return multiple pages
    mockSearchService.searchJobs.mockResolvedValue({
      jobs: [
        { id: 1, title: 'Job 1' },
        { id: 2, title: 'Job 2' }
      ],
      total: 25,
      page: 1,
      limit: 10,
      totalPages: 3
    })

    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Check that pagination controls are visible
    expect(wrapper.find('.pagination').exists()).toBe(true)
    expect(wrapper.text()).toContain('Page 1 of 3')

    // Mock next page response
    mockSearchService.searchJobs.mockResolvedValueOnce({
      jobs: [
        { id: 11, title: 'Job 11' },
        { id: 12, title: 'Job 12' }
      ],
      total: 25,
      page: 2,
      limit: 10,
      totalPages: 3
    })

    // Click next button
    const nextButton = wrapper.find('.pagination-button:not(:disabled)')
    await nextButton.trigger('click')

    await flushPromises()

    // Check that search service was called with page 2
    expect(mockSearchService.searchJobs).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2 })
    )
  })

  it('handles job save toggle', async () => {
    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Find the first job card
    const jobCard = wrapper.findComponent(JobCard)

    // Emit save event from job card
    jobCard.vm.$emit('save', 1)

    // Emit save event again (should remove from saved)
    jobCard.vm.$emit('save', 1)

    // The component should handle these events without errors
    expect(wrapper.exists()).toBe(true)
  })

  it('navigates to job details when view-details is emitted', async () => {
    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    // Find the first job card
    const jobCard = wrapper.findComponent(JobCard)

    // Emit view-details event from job card
    jobCard.vm.$emit('view-details', 1)

    // Wait for navigation
    await flushPromises()

    // Check that we're navigating to the job details page
    expect(router.currentRoute.value.path).toBe('/jobs/1')
  })

  it('shows no results message when search returns empty', async () => {
    // Mock search service to return no results
    mockSearchService.searchJobs.mockResolvedValue({
      jobs: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    })

    const wrapper = mount(JobsPage, {
      global: {
        plugins: [router]
      }
    })

    await flushPromises()

    expect(wrapper.text()).toContain('No jobs found')
  })
})