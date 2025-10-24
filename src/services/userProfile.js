// User Profile Management Service for JobNaut
// Handles user profile CRUD operations and management

const userService = require('../models/user');

/**
 * User Profile Management Service
 */
class UserProfileService {
  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User profile data
   */
  async getProfile(userId) {
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Parse skills JSON if it exists
    let skills = [];
    if (user.skills) {
      try {
        skills = JSON.parse(user.skills);
      } catch (error) {
        console.warn('Failed to parse user skills:', error);
        skills = [];
      }
    }

    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      location: user.location,
      experienceLevel: user.experienceLevel,
      skills: skills,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated user profile
   */
  async updateProfile(userId, profileData) {
    // Validate and sanitize input data
    const updateData = {};

    if (profileData.name !== undefined) {
      updateData.name = profileData.name;
    }

    if (profileData.location !== undefined) {
      updateData.location = profileData.location;
    }

    if (profileData.experienceLevel !== undefined) {
      updateData.experienceLevel = profileData.experienceLevel;
    }

    if (profileData.skills !== undefined) {
      // Validate skills is an array
      if (Array.isArray(profileData.skills)) {
        updateData.skills = profileData.skills;
      } else {
        throw new Error('Skills must be an array');
      }
    }

    const updatedUser = await userService.updateUser(userId, updateData);

    // Parse skills JSON for response
    let skills = [];
    if (updatedUser.skills) {
      try {
        skills = JSON.parse(updatedUser.skills);
      } catch (error) {
        console.warn('Failed to parse user skills:', error);
        skills = [];
      }
    }

    return {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      name: updatedUser.name,
      location: updatedUser.location,
      experienceLevel: updatedUser.experienceLevel,
      skills: skills,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Add skills to user profile
   * @param {number} userId - User ID
   * @param {Array} newSkills - Array of new skills to add
   * @returns {Promise<Object>} Updated user profile
   */
  async addSkills(userId, newSkills) {
    // Get current user profile
    const currentUser = await userService.getUserById(userId);

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Parse existing skills
    let existingSkills = [];
    if (currentUser.skills) {
      try {
        existingSkills = JSON.parse(currentUser.skills);
      } catch (error) {
        console.warn('Failed to parse existing user skills:', error);
        existingSkills = [];
      }
    }

    // Merge and deduplicate skills
    const allSkills = [...new Set([...existingSkills, ...newSkills])];

    // Update user with new skills
    const updatedUser = await userService.updateUser(userId, {
      skills: allSkills,
    });

    return {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      name: updatedUser.name,
      location: updatedUser.location,
      experienceLevel: updatedUser.experienceLevel,
      skills: allSkills,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }

  /**
   * Remove skills from user profile
   * @param {number} userId - User ID
   * @param {Array} skillsToRemove - Array of skills to remove
   * @returns {Promise<Object>} Updated user profile
   */
  async removeSkills(userId, skillsToRemove) {
    // Get current user profile
    const currentUser = await userService.getUserById(userId);

    if (!currentUser) {
      throw new Error('User not found');
    }

    // Parse existing skills
    let existingSkills = [];
    if (currentUser.skills) {
      try {
        existingSkills = JSON.parse(currentUser.skills);
      } catch (error) {
        console.warn('Failed to parse existing user skills:', error);
        existingSkills = [];
      }
    }

    // Remove specified skills
    const updatedSkills = existingSkills.filter(
      skill => !skillsToRemove.includes(skill)
    );

    // Update user with new skills
    const updatedUser = await userService.updateUser(userId, {
      skills: updatedSkills,
    });

    return {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email,
      name: updatedUser.name,
      location: updatedUser.location,
      experienceLevel: updatedUser.experienceLevel,
      skills: updatedSkills,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt,
    };
  }
}

module.exports = new UserProfileService();