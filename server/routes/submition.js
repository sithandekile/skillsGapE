// Get submissions for a specific problem (employer view)
const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Problem = require('../models/Problem');
const auth = require('../midleware/auth');
const upload = require('../midleware/upload');

// Submit a solution
router.post('/:problemId', auth, upload.single('solutionFile'), async (req, res) => {
  try {
    const { solutionText, githubRepo, liveDemo } = req.body;
    const problem = await Problem.findById(req.params.problemId);

    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    const submission = new Submission({
      problemId: problem._id,
      submittedBy: req.user._id,
      solutionText,
      githubRepo,
      liveDemo,
      solutionFile: req.file ? req.file.path : null
    });

    await submission.save();

    problem.submissions.push(submission._id);
    await problem.save();

    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/problem/:problemId', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ problemId: req.params.problemId })
      .populate('submittedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's submissions
router.get('/my-submissions', auth, async (req, res) => {
  try {
    const submissions = await Submission.find({ submittedBy: req.user._id })
      .populate('problemId', 'title')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update submission status
router.patch('/:id', auth, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('submittedBy', 'username');
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports=router;