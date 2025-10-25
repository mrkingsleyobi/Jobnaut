<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="profile-avatar">
        <div class="avatar-placeholder">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="avatar-icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <button class="change-avatar-button">Change Photo</button>
      </div>

      <div class="profile-basic-info">
        <h1 class="profile-name">{{ profile.name }}</h1>
        <p class="profile-email">{{ profile.email }}</p>
        <p class="profile-location">{{ profile.location }}</p>
      </div>
    </div>

    <div class="profile-content">
      <div class="profile-section">
        <h2 class="section-title">Personal Information</h2>
        <div class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label for="name" class="form-label">Full Name</label>
              <input
                id="name"
                v-model="profile.name"
                type="text"
                class="form-input"
              />
            </div>

            <div class="form-group">
              <label for="location" class="form-label">Location</label>
              <input
                id="location"
                v-model="profile.location"
                type="text"
                class="form-input"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="bio" class="form-label">Bio</label>
            <textarea
              id="bio"
              v-model="profile.bio"
              class="form-textarea"
              rows="4"
              placeholder="Tell us about yourself..."
            ></textarea>
          </div>

          <button @click="updateProfile" class="update-button">
            Update Profile
          </button>
        </div>
      </div>

      <div class="profile-section">
        <div class="section-header">
          <h2 class="section-title">Skills</h2>
          <div class="skills-stats">
            <span class="skill-count">{{ profile.skills.length }} skills</span>
          </div>
        </div>

        <div class="skills-section">
          <div class="skills-input">
            <input
              v-model="newSkill"
              type="text"
              placeholder="Add a skill (e.g., JavaScript, React, Python)"
              class="form-input"
              @keyup.enter="addSkill"
            />
            <button @click="addSkill" class="add-skill-button">Add</button>
          </div>

          <div class="skills-list">
            <div
              v-for="(skill, index) in profile.skills"
              :key="index"
              class="skill-item"
            >
              <span class="skill-name">{{ skill }}</span>
              <button
                @click="removeSkill(index)"
                class="remove-skill-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="remove-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <div class="section-header">
          <h2 class="section-title">Saved Jobs</h2>
          <div class="saved-jobs-stats">
            <span class="job-count">{{ savedJobs.length }} saved</span>
          </div>
        </div>

        <div v-if="savedJobs.length === 0" class="no-saved-jobs">
          <div class="empty-state">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="empty-icon"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <p>You haven't saved any jobs yet</p>
            <NuxtLink to="/jobs" class="browse-jobs-link">
              Browse Jobs
            </NuxtLink>
          </div>
        </div>

        <div v-else class="saved-jobs-list">
          <div
            v-for="job in savedJobs"
            :key="job.id"
            class="saved-job-card"
          >
            <div class="job-info">
              <h3 class="job-title">{{ job.title }}</h3>
              <p class="job-company">{{ job.company }}</p>
              <p class="job-location">{{ job.location }}</p>
            </div>

            <div class="job-actions">
              <button @click="viewJob(job.id)" class="view-button">
                View Details
              </button>
              <button @click="removeSavedJob(job.id)" class="remove-button">
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="profile-section">
        <h2 class="section-title">Preferences</h2>
        <div class="preferences-form">
          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="preferences.emailNotifications"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-text">Email notifications for new jobs</span>
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="preferences.weeklyDigest"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-text">Weekly job recommendations</span>
            </label>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input
                v-model="preferences.applicationUpdates"
                type="checkbox"
                class="checkbox-input"
              />
              <span class="checkbox-text">Application status updates</span>
            </label>
          </div>

          <button @click="updatePreferences" class="update-button">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Reactive state
const profile = ref({
  name: 'John Doe',
  email: 'john.doe@example.com',
  location: 'San Francisco, CA',
  bio: 'Software engineer with 5 years of experience in web development. Passionate about creating innovative solutions and learning new technologies.',
  skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Docker']
})

const newSkill = ref('')
const savedJobs = ref([
  {
    id: 1,
    title: 'Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA'
  },
  {
    id: 3,
    title: 'Senior Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote'
  },
  {
    id: 5,
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Seattle, WA'
  }
])

const preferences = ref({
  emailNotifications: true,
  weeklyDigest: true,
  applicationUpdates: false
})

// Methods
const updateProfile = () => {
  // Update user profile
  console.log('Updating profile:', profile.value)
  alert('Profile updated successfully!')
}

const addSkill = () => {
  if (newSkill.value.trim() !== '') {
    profile.value.skills.push(newSkill.value.trim())
    newSkill.value = ''
  }
}

const removeSkill = (index) => {
  profile.value.skills.splice(index, 1)
}

const removeSavedJob = (jobId) => {
  const index = savedJobs.value.findIndex(job => job.id === jobId)
  if (index !== -1) {
    savedJobs.value.splice(index, 1)
  }
}

const viewJob = (jobId) => {
  router.push(`/jobs/${jobId}`)
}

const updatePreferences = () => {
  // Update user preferences
  console.log('Updating preferences:', preferences.value)
  alert('Preferences saved successfully!')
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-header {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.profile-avatar {
  text-align: center;
}

.avatar-placeholder {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.avatar-icon {
  width: 48px;
  height: 48px;
  color: white;
}

.change-avatar-button {
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.change-avatar-button:hover {
  background-color: #f3f4f6;
}

.profile-basic-info {
  flex: 1;
}

.profile-name {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
}

.profile-email {
  margin: 0 0 0.25rem 0;
  color: #3b82f6;
  font-weight: 500;
}

.profile-location {
  margin: 0;
  color: #6b7280;
}

.profile-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.profile-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  border-bottom: 2px solid #f3f4f6;
  padding-bottom: 0.5rem;
}

.skill-count,
.job-count {
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.update-button {
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.update-button:hover {
  background-color: #2563eb;
}

.skills-input {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.add-skill-button {
  background-color: #10b981;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-skill-button:hover {
  background-color: #059669;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.skill-item {
  background-color: #eff6ff;
  color: #1d4ed8;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.remove-skill-button {
  background: none;
  border: none;
  color: #1d4ed8;
  cursor: pointer;
  padding: 0;
  margin: 0;
  line-height: 1;
  display: flex;
  align-items: center;
}

.remove-icon {
  width: 16px;
  height: 16px;
}

.no-saved-jobs {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state {
  color: #6b7280;
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 1rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.browse-jobs-link {
  display: inline-block;
  background-color: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
}

.browse-jobs-link:hover {
  background-color: #2563eb;
}

.saved-jobs-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.saved-job-card {
  background-color: #f9fafb;
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid #e5e7eb;
  transition: transform 0.2s, box-shadow 0.2s;
}

.saved-job-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.job-info {
  margin-bottom: 1rem;
}

.job-title {
  margin: 0 0 0.25rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #111827;
}

.job-company {
  margin: 0 0 0.25rem 0;
  color: #3b82f6;
  font-weight: 500;
}

.job-location {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.job-actions {
  display: flex;
  gap: 0.5rem;
}

.view-button,
.remove-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  flex: 1;
}

.view-button {
  background-color: #3b82f6;
  color: white;
}

.view-button:hover {
  background-color: #2563eb;
}

.remove-button {
  background-color: #f3f4f6;
  color: #374151;
}

.remove-button:hover {
  background-color: #e5e7eb;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checkbox-text {
  color: #374151;
  font-weight: 500;
}

@media (max-width: 768px) {
  .profile-page {
    padding: 1rem;
  }

  .profile-header {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .saved-jobs-list {
    grid-template-columns: 1fr;
  }

  .job-actions {
    flex-direction: column;
  }
}
</style>