const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  rewardType: {
    type: String,
    enum: ['job', 'internship', 'cash', 'contract'],
    required: true
  },
  rewardDetails: {
    type: String,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    type: Number,
    min: 0
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  status: {
    type: String,
    enum: ['open', 'closed', 'in-review'],
    default: 'open'
  },
  submissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission'
  }]
}, {
  timestamps: true
});

module.exports =  mongoose.models.Problem || mongoose.model('Problem', problemSchema);