const express = require('express');
const Problem = require('../models/problem');
const auth = require('../midleware/auth');
const router = express.Router();

// Get all problems with optional filtering
router.get('/', async (req, res) => {
  try {
    const { skill, difficulty, rewardType } = req.query;
    
    // Build filter object
    let filter = { status: 'open' }; // Only show open problems by default
    
    if (difficulty) {
      filter.difficulty = difficulty;
    }
    
    if (rewardType) {
      filter.rewardType = rewardType;
    }
    
    if (skill) {
      filter.skillsRequired = { $regex: skill, $options: 'i' }; 
    }

    const problems = await Problem.find(filter)
      .populate('postedBy', 'username email')
      .sort({ createdAt: -1 });
    
    res.json(problems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ message: 'Error fetching problems' });
  }
});

// Creating a new problem (protected route)
router.post('/', auth, async (req, res) => {
  try {
    // Checking if user is an employer
    if (req.user.role !== 'employer') {
      return res.status(403).json({ message: 'Only employers can post problems' });
    }

    const problem = new Problem({
      ...req.body,
      postedBy: req.user._id
    });

    await problem.save();
    await problem.populate('postedBy', 'username email');
    
    res.status(201).json(problem);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating problem' });
  }
});

//  Get problems posted by current user
router.get('/my-problems', auth, async (req, res) => {
  try {
    const problems = await Problem.find({ postedBy: req.user._id })
      .populate('postedBy', 'username email')
      .sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//  Get single problem by ID
router.get('/:id', async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).populate('postedBy', 'username email');
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;