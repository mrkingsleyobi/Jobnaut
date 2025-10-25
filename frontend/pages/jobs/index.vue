<template>
  <div class="jobs-page">
    <JobSearch @search="handleSearch" @clear-filters="loadJobs" />

    <div class="results-header">
      <h2 class="results-title">Job Listings</h2>
      <p class="results-count">{{ jobs.length }} jobs found</p>
    </div>

    <div class="results-section">
      <div v-if="loading" class="loading">Loading jobs...</div>
      <div v-else-if="jobs.length === 0" class="no-results">No jobs found</div>
      <div v-else class="jobs-grid">
        <JobCard
          v-for="job in jobs"
          :key="job.id"
          :job="job"
          :is-saved="isJobSaved(job.id)"
          @view-details="viewJobDetails"
          @save="toggleSaveJob"
        />
      </div>
    </div>

    <div v-if="jobs.length > 0 && totalPages > 1" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="previousPage"
        class="pagination-button"
      >
        Previous
      </button>
      <span class="page-info">
        Page {{ currentPage }} of {{ totalPages }}
      </span>
      <button
        :disabled="currentPage === totalPages"
        @click="nextPage"
        class="pagination-button"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import JobSearch from '../../components/JobSearch.vue'
import JobCard from '../../components/JobCard.vue'
import searchService from '../../services/searchService'

// Router
const router = useRouter()

// Reactive state
const jobs = ref([])
const loading = ref(false)
const savedJobs = ref(new Set())
const currentPage = ref(1)
const totalPages = ref(1)
const searchParams = ref({
  query: '',
  location: '',
  experience: '',
  jobType: ''
})

// Mock job data for fallback
const mockJobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'Exciting opportunity for a software engineer to join our team...',
    skills: ['JavaScript', 'React', 'Node.js', 'Python'],
    postedDate: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'Startup Inc',
    location: 'New York, NY',
    description: 'Lead product development for our innovative platform...',
    skills: ['Product Management', 'Agile', 'UX', 'Analytics'],
    postedDate: new Date().toISOString()
  },
  {
    id: 3,
    title: 'Senior Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    description: 'Join our team building cutting-edge web applications...',
    skills: ['React', 'TypeScript', 'CSS', 'GraphQL'],
    postedDate: new Date().toISOString()
  },
  {
    id: 4,
    title: 'Data Scientist',
    company: 'Analytics Pro',
    location: 'Los Angeles, CA',
    description: 'Analyze complex datasets to drive business insights...',
    skills: ['Python', 'Machine Learning', 'SQL', 'Statistics'],
    postedDate: new Date().toISOString()
  },
  {
    id: 5,
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Seattle, WA',
    description: 'Create intuitive user experiences for our products...',
    skills: ['Figma', 'User Research', 'Prototyping', 'UI Design'],
    postedDate: new Date().toISOString()
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    company: 'Cloud Services',
    location: 'Remote',
    description: 'Manage and optimize our cloud infrastructure...',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    postedDate: new Date().toISOString()
  }
]

// Methods
const loadJobs = async () => {
  loading.value = true

  try {
    const result = await searchService.searchJobs({
      query: searchParams.value.query,
      location: searchParams.value.location,
      experience: searchParams.value.experience,
      jobType: searchParams.value.jobType,
      page: currentPage.value,
      limit: 10
    })
    jobs.value = result.jobs
    totalPages.value = result.totalPages
    loading.value = false
  } catch (error) {
    console.error('Error loading jobs:', error)
    // Use mock data as fallback
    setTimeout(() => {
      jobs.value = mockJobs
      totalPages.value = Math.ceil(mockJobs.length / 10)
      loading.value = false
    }, 500)
  }
}

const handleSearch = (params) => {
  searchParams.value = params
  currentPage.value = 1
  loadJobs()
}

const viewJobDetails = (jobId) => {
  router.push(`/jobs/${jobId}`)
}

const toggleSaveJob = (jobId) => {
  if (savedJobs.value.has(jobId)) {
    savedJobs.value.delete(jobId)
  } else {
    savedJobs.value.add(jobId)
  }
}

const isJobSaved = (jobId) => {
  return savedJobs.value.has(jobId)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadJobs()
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    loadJobs()
  }
}

// Load jobs on component mount
onMounted(() => {
  loadJobs()
})
</script>

<style scoped>
.jobs-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.results-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
}

.results-count {
  margin: 0;
  color: #6b7280;
}

.results-section {
  min-height: 400px;
  margin-bottom: 2rem;
}

.loading,
.no-results {
  text-align: center;
  padding: 3rem;
  font-size: 1.1rem;
  color: #6b7280;
}

.jobs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-button {
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.pagination-button:hover:not(:disabled) {
  background-color: #e5e7eb;
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #374151;
  font-weight: 500;
}

@media (max-width: 768px) {
  .jobs-page {
    padding: 1rem;
  }

  .results-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .results-title {
    font-size: 1.25rem;
  }

  .results-count {
    font-size: 0.9rem;
  }

  .jobs-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .pagination {
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .pagination-button {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  .page-info {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .jobs-page {
    padding: 0.75rem;
  }

  .results-header {
    gap: 0.25rem;
  }

  .results-title {
    font-size: 1.1rem;
  }

  .results-count {
    font-size: 0.8rem;
  }

  .jobs-grid {
    gap: 0.75rem;
  }

  .loading,
  .no-results {
    padding: 2rem 1rem;
    font-size: 1rem;
  }

  .pagination {
    gap: 0.25rem;
  }

  .pagination-button {
    padding: 0.3rem 0.6rem;
    font-size: 0.8rem;
  }

  .page-info {
    font-size: 0.8rem;
  }
}
</style>