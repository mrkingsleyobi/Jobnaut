// Job model service for JobNaut
// Handles all job-related database operations

const prisma = require('../db/client');

/**
 * Job model service
 */
class JobService {
  /**
   * Create a new job
   * @param {Object} jobData - Job data
   * @param {string} jobData.title - Job title
   * @param {string} jobData.company - Company name
   * @param {string} jobData.location - Job location
   * @param {string} jobData.description - Job description
   * @param {Array} jobData.skills - Job skills
   * @param {Date} jobData.postedDate - Job posted date
   * @param {string} [jobData.applicationLink] - Application link
   * @returns {Promise<Object>} Created job
   */
  async createJob(jobData) {
    return await prisma.job.create({
      data: {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        description: jobData.description,
        skills: JSON.stringify(jobData.skills),
        postedDate: jobData.postedDate,
        applicationLink: jobData.applicationLink,
      },
    });
  }

  /**
   * Get job by ID
   * @param {number} id - Job ID
   * @returns {Promise<Object|null>} Job or null if not found
   */
  async getJobById(id) {
    return await prisma.job.findUnique({
      where: { id },
    });
  }

  /**
   * Get all jobs with pagination
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of jobs per page (default: 10)
   * @returns {Promise<Object>} Jobs and pagination info
   */
  async getAllJobs(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        skip,
        take: limit,
        orderBy: {
          postedDate: 'desc',
        },
      }),
      prisma.job.count(),
    ]);

    return {
      jobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Search jobs by title, company, or location
   * @param {string} query - Search query
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of jobs per page (default: 10)
   * @returns {Promise<Object>} Search results and pagination info
   */
  async searchJobs(query, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: limit,
        orderBy: {
          postedDate: 'desc',
        },
      }),
      prisma.job.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { company: { contains: query, mode: 'insensitive' } },
            { location: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
      }),
    ]);

    return {
      jobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update job
   * @param {number} id - Job ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated job
   */
  async updateJob(id, updateData) {
    // Convert skills array to JSON string if provided
    if (updateData.skills) {
      updateData.skills = JSON.stringify(updateData.skills);
    }

    return await prisma.job.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete job
   * @param {number} id - Job ID
   * @returns {Promise<Object>} Deleted job
   */
  async deleteJob(id) {
    return await prisma.job.delete({
      where: { id },
    });
  }

  /**
   * Get jobs by skills
   * @param {Array} skills - Skills to match
   * @param {number} page - Page number (default: 1)
   * @param {number} limit - Number of jobs per page (default: 10)
   * @returns {Promise<Object>} Jobs and pagination info
   */
  async getJobsBySkills(skills, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    // Create OR conditions for each skill
    const skillConditions = skills.map(skill => ({
      skills: {
        path: '$[*]',
        string_contains: skill,
      },
    }));

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where: {
          OR: skillConditions,
        },
        skip,
        take: limit,
        orderBy: {
          postedDate: 'desc',
        },
      }),
      prisma.job.count({
        where: {
          OR: skillConditions,
        },
      }),
    ]);

    return {
      jobs,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

module.exports = new JobService();