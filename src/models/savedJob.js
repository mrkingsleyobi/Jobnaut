// Saved Job model service for JobNaut
// Handles all saved job-related database operations

const prisma = require('../db/client');

/**
 * Saved Job model service
 */
class SavedJobService {
  /**
   * Save a job for a user
   * @param {Object} savedJobData - Saved job data
   * @param {number} savedJobData.userId - User ID
   * @param {number} savedJobData.jobId - Job ID
   * @param {string} [savedJobData.notes] - Notes about the saved job
   * @param {string} [savedJobData.applicationStatus] - Application status
   * @returns {Promise<Object>} Created saved job
   */
  async saveJob(savedJobData) {
    return await prisma.savedJob.create({
      data: {
        userId: savedJobData.userId,
        jobId: savedJobData.jobId,
        notes: savedJobData.notes,
        applicationStatus: savedJobData.applicationStatus,
      },
    });
  }

  /**
   * Get saved jobs for a user
   * @param {number} userId - User ID
   * @returns {Promise<Array>} Array of saved jobs
   */
  async getSavedJobsByUser(userId) {
    return await prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: true, // Include job details
      },
    });
  }

  /**
   * Get a specific saved job
   * @param {number} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Promise<Object|null>} Saved job or null if not found
   */
  async getSavedJob(userId, jobId) {
    return await prisma.savedJob.findUnique({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      include: {
        job: true,
      },
    });
  }

  /**
   * Update a saved job
   * @param {number} userId - User ID
   * @param {number} jobId - Job ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated saved job
   */
  async updateSavedJob(userId, jobId, updateData) {
    return await prisma.savedJob.update({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
      data: updateData,
    });
  }

  /**
   * Delete a saved job
   * @param {number} userId - User ID
   * @param {number} jobId - Job ID
   * @returns {Promise<Object>} Deleted saved job
   */
  async deleteSavedJob(userId, jobId) {
    return await prisma.savedJob.delete({
      where: {
        userId_jobId: {
          userId,
          jobId,
        },
      },
    });
  }
}

module.exports = new SavedJobService();