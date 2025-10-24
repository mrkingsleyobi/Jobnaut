import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import SearchService from '~/services/searchService'

// Mock MeiliSearch
const mockSearchResult = {
  hits: [
    {
      id: 1,
      title: 'Software Engineer',
      company: 'Tech Corp',
      location: 'San Francisco, CA'
    }
  ],
  estimatedTotalHits: 1,
  offset: 0,
  limit: 20
}

const mockGetDocumentResult = {
  id: 1,
  title: 'Software Engineer',
  company: 'Tech Corp',
  location: 'San Francisco, CA'
}

const mockAddDocumentsResult = {
  taskUid: 123456
}

const mockUpdateDocumentsResult = {
  taskUid: 123457
}

const mockDeleteDocumentResult = {
  taskUid: 123458
}

const mockIndex = {
  search: vi.fn().mockResolvedValue(mockSearchResult),
  getDocument: vi.fn().mockResolvedValue(mockGetDocumentResult),
  addDocuments: vi.fn().mockResolvedValue(mockAddDocumentsResult),
  updateDocuments: vi.fn().mockResolvedValue(mockUpdateDocumentsResult),
  deleteDocument: vi.fn().mockResolvedValue(mockDeleteDocumentResult)
}

const mockClient = {
  index: vi.fn().mockReturnValue(mockIndex)
}

// Mock MeiliSearch module
vi.mock('meilisearch', () => {
  return {
    MeiliSearch: vi.fn().mockImplementation(() => mockClient)
  }
})

describe('SearchService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks()
  })

  it('initializes MeiliSearch client with correct configuration', () => {
    const service = new SearchService()

    expect(mockClient.index).toHaveBeenCalledWith('jobs')
    expect(service.client).toBe(mockClient)
    expect(service.jobIndex).toBe(mockIndex)
  })

  it('searches jobs with query and filters', async () => {
    const service = new SearchService()

    const params = {
      query: 'software engineer',
      location: 'San Francisco, CA',
      experience: 'mid',
      jobType: 'full-time',
      page: 1,
      limit: 10
    }

    const result = await service.searchJobs(params)

    expect(mockIndex.search).toHaveBeenCalledWith('software engineer', {
      filter: [
        'location = "San Francisco, CA"',
        'experienceLevel = "mid"',
        'jobType = "full-time"'
      ],
      limit: 10,
      offset: 0,
      sort: ['postedDate:desc']
    })

    expect(result).toEqual({
      jobs: mockSearchResult.hits,
      total: mockSearchResult.estimatedTotalHits,
      page: 1,
      limit: 10,
      totalPages: 1
    })
  })

  it('searches jobs with remote location filter', async () => {
    const service = new SearchService()

    const params = {
      location: 'remote'
    }

    await service.searchJobs(params)

    expect(mockIndex.search).toHaveBeenCalledWith('', {
      filter: ['location = "Remote"'],
      limit: 20,
      offset: 0,
      sort: ['postedDate:desc']
    })
  })

  it('searches jobs without filters when none provided', async () => {
    const service = new SearchService()

    await service.searchJobs()

    expect(mockIndex.search).toHaveBeenCalledWith('', {
      filter: undefined,
      limit: 20,
      offset: 0,
      sort: ['postedDate:desc']
    })
  })

  it('gets job by ID', async () => {
    const service = new SearchService()

    const jobId = '123'
    const result = await service.getJobById(jobId)

    expect(mockIndex.getDocument).toHaveBeenCalledWith(jobId)
    expect(result).toEqual(mockGetDocumentResult)
  })

  it('gets recommendations based on user skills', async () => {
    const service = new SearchService()

    const userSkills = ['JavaScript', 'React', 'Node.js']
    const limit = 5

    const result = await service.getRecommendations(userSkills, limit)

    expect(mockIndex.search).toHaveBeenCalledWith('JavaScript OR React OR Node.js', {
      limit: 5,
      sort: ['matchScore:desc', 'postedDate:desc']
    })

    expect(result).toEqual(mockSearchResult.hits)
  })

  it('indexes jobs', async () => {
    const service = new SearchService()

    const jobs = [
      { id: 1, title: 'Job 1' },
      { id: 2, title: 'Job 2' }
    ]

    const result = await service.indexJobs(jobs)

    expect(mockIndex.addDocuments).toHaveBeenCalledWith(jobs)
    expect(result).toEqual(mockAddDocumentsResult)
  })

  it('updates job', async () => {
    const service = new SearchService()

    const job = { id: 1, title: 'Updated Job' }

    const result = await service.updateJob(job)

    expect(mockIndex.updateDocuments).toHaveBeenCalledWith([job])
    expect(result).toEqual(mockUpdateDocumentsResult)
  })

  it('deletes job', async () => {
    const service = new SearchService()

    const jobId = '123'

    const result = await service.deleteJob(jobId)

    expect(mockIndex.deleteDocument).toHaveBeenCalledWith(jobId)
    expect(result).toEqual(mockDeleteDocumentResult)
  })

  it('handles search errors gracefully', async () => {
    const service = new SearchService()

    // Mock search to throw an error
    mockIndex.search.mockRejectedValueOnce(new Error('Search failed'))

    await expect(service.searchJobs({ query: 'test' }))
      .rejects
      .toThrow('Failed to search jobs: Search failed')
  })

  it('handles get job by ID errors gracefully', async () => {
    const service = new SearchService()

    // Mock getDocument to throw an error
    mockIndex.getDocument.mockRejectedValueOnce(new Error('Job not found'))

    await expect(service.getJobById('123'))
      .rejects
      .toThrow('Failed to get job: Job not found')
  })
})