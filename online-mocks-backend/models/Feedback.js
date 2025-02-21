const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true
  },
  hrName: {
    type: String,
    required: true
  },
  technicalKnowledge: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  serviceAndCoordination: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  communicationSkills: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  futureParticipation: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  punctualityAndInterest: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  suggestions: {
    type: String,
    required: false
  },
  issuesFaced: {
    type: String,
    required: false
  },
  improvementSuggestions: {
    type: String,
    required: false
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
