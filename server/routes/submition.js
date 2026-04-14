const express = require('express');
const router = express.Router();
const Submission = require('../models/submission');
const Problem = require('../models/problem');
const auth = require('../midleware/auth');
const upload = require('../midleware/upload');

// Middleware: only employer
const employerOnly = (req, res, next) => {
  if (req.user.role !== 'employer') {
    return res.status(403).json({ message: 'Access denied: Employers only' });
  }
  next();
};

// Submit a solution (Job seeker)
router.post('/:problemId', auth, upload.single('solutionFile'), async (req, res) => {
  try {
    const { solutionText, githubRepo, liveDemo } = req.body;
    const problem = await Problem.findById(req.params.problemId);

    if (!problem) return res.status(404).json({ message: 'Problem not found' });

    // Normalize file path for cross-platform compatibility
    const filePath = req.file ? req.file.path.replace(/\\/g, '/') : null;

    const submission = new Submission({
      problemId: problem._id,
      submittedBy: req.user._id,
      solutionText,
      githubRepo,
      liveDemo,
      solutionFile: filePath
    });

    await submission.save();
    problem.submissions.push(submission._id);
    await problem.save();

    res.status(201).json(submission);
  } catch (error) {
    console.error('Submission error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get all submissions for a problem (Employer view)
router.get('/problem/:problemId', auth, employerOnly, async (req, res) => {
  try {
    const submissions = await Submission.find({ problemId: req.params.problemId })
      .populate('submittedBy', 'email username')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user's submissions (Job seeker)
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

// Update submission status (general)
router.patch('/:id', auth, employerOnly, async (req, res) => {
  try {
    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    ).populate('submittedBy', 'username');

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update submission score (Employer)
router.patch('/:id/score', auth, employerOnly, async (req, res) => {
  try {
    const { score } = req.body;
    const submission = await Submission.findById(req.params.id);

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.score = score;
    submission.status = 'reviewed';
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Set a submission as winner (Employer)
router.patch('/:id/winner', auth, employerOnly, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    // Set all submissions for this problem to reviewed first
    await Submission.updateMany(
      { problemId: submission.problemId },
      { status: 'reviewed' }
    );

    // Mark this submission as winner
    submission.status = 'winner';
    await submission.save();

    res.json(submission);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
