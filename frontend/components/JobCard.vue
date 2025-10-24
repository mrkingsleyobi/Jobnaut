<template>
  <div class="job-card" @click="$emit('view-details', job.id)">
    <div class="job-header">
      <h3 class="job-title">{{ job.title }}</h3>
      <p class="job-company">{{ job.company }}</p>
    </div>

    <div class="job-details">
      <p class="job-location">{{ job.location }}</p>
      <p class="job-description">{{ truncatedDescription }}</p>

      <div class="job-skills">
        <span
          v-for="skill in displayedSkills"
          :key="skill"
          class="skill-tag"
        >
          {{ skill }}
        </span>
        <span v-if="job.skills.length > 3" class="more-skills">
          +{{ job.skills.length - 3 }} more
        </span>
      </div>

      <p class="job-posted">Posted: {{ formatDate(job.postedDate) }}</p>
    </div>

    <div class="job-actions">
      <button
        @click.stop="$emit('save', job.id)"
        class="save-button"
        :class="{ saved: isSaved }"
      >
        {{ isSaved ? 'Saved' : 'Save' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  job: {
    type: Object,
    required: true
  },
  isSaved: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view-details', 'save'])

// Computed properties
const truncatedDescription = computed(() => {
  if (!props.job.description) return ''
  return props.job.description.length > 100
    ? props.job.description.substring(0, 100) + '...'
    : props.job.description
})

const displayedSkills = computed(() => {
  return props.job.skills ? props.job.skills.slice(0, 3) : []
})

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString()
}
</script>

<style scoped>
.job-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #e1e5e9;
}

.job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.job-header {
  margin-bottom: 1rem;
}

.job-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
  color: #1a1a1a;
  font-weight: 600;
}

.job-company {
  margin: 0;
  color: #3b82f6;
  font-weight: 500;
}

.job-details {
  margin-bottom: 1rem;
}

.job-location {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.job-description {
  margin: 0 0 1rem 0;
  color: #374151;
  line-height: 1.5;
}

.job-skills {
  margin: 0 0 1rem 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #eff6ff;
  color: #1d4ed8;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.more-skills {
  background-color: #f3f4f6;
  color: #6b7280;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 500;
}

.job-posted {
  margin: 0;
  color: #9ca3af;
  font-size: 0.85rem;
}

.job-actions {
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background-color: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.save-button:hover {
  background-color: #e5e7eb;
}

.save-button.saved {
  background-color: #dbeafe;
  color: #1d4ed8;
}

.save-button.saved:hover {
  background-color: #bfdbfe;
}
</style>