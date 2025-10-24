// User routes for JobNaut
// Handles user profile related endpoints

const express = require('express');
const { authMiddleware } = require('../auth/middleware');
const userProfileService = require('../services/userProfile');

const router = express.Router();

/**
 * GET /user/profile
 * Get current user's profile
 */
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await userProfileService.getProfile(req.user.id);
    res.json({ profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

/**
 * PUT /user/profile
 * Update current user's profile
 */
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const profileData = req.body;
    const updatedProfile = await userProfileService.updateProfile(req.user.id, profileData);
    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error updating user profile:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.message === 'Skills must be an array') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

/**
 * POST /user/skills
 * Add skills to user's profile
 */
router.post('/skills', authMiddleware, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const updatedProfile = await userProfileService.addSkills(req.user.id, skills);
    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error adding skills:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to add skills' });
  }
});

/**
 * DELETE /user/skills
 * Remove skills from user's profile
 */
router.delete('/skills', authMiddleware, async (req, res) => {
  try {
    const { skills } = req.body;

    if (!Array.isArray(skills)) {
      return res.status(400).json({ error: 'Skills must be an array' });
    }

    const updatedProfile = await userProfileService.removeSkills(req.user.id, skills);
    res.json({ profile: updatedProfile });
  } catch (error) {
    console.error('Error removing skills:', error);
    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to remove skills' });
  }
});

module.exports = router;