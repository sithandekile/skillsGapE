const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  submittedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  solutionText: {
    type: String,
    required: true
  },
  solutionFile: {
    type: String // URL to uploaded file
  },
  githubRepo: {
    type: String
  },
  liveDemo: {
    type: String
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'winner', 'rejected'],
    default: 'pending'
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  feedback: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);