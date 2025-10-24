// User model service for JobNaut
// Handles all user-related database operations

const prisma = require('../db/client');

/**
 * User model service
 */
class UserService {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @param {string} userData.clerkId - Clerk user ID
   * @param {string} userData.email - User email
   * @param {string} [userData.name] - User name
   * @param {string} [userData.location] - User location
   * @param {string} [userData.experienceLevel] - User experience level
   * @param {Array} [userData.skills] - User skills
   * @returns {Promise<Object>} Created user
   */
  async createUser(userData) {
    return await prisma.user.create({
      data: {
        clerkId: userData.clerkId,
        email: userData.email,
        name: userData.name,
        location: userData.location,
        experienceLevel: userData.experienceLevel,
        skills: userData.skills ? JSON.stringify(userData.skills) : null,
      },
    });
  }

  /**
   * Get user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User or null if not found
   */
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Get user by Clerk ID
   * @param {string} clerkId - Clerk user ID
   * @returns {Promise<Object|null>} User or null if not found
   */
  async getUserByClerkId(clerkId) {
    return await prisma.user.findUnique({
      where: { clerkId },
    });
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User or null if not found
   */
  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Update user profile
   * @param {number} id - User ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated user
   */
  async updateUser(id, updateData) {
    // Convert skills array to JSON string if provided
    if (updateData.skills) {
      updateData.skills = JSON.stringify(updateData.skills);
    }

    return await prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Delete user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Deleted user
   */
  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

module.exports = new UserService();