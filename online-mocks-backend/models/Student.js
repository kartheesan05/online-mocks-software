const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  registerNumber: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  aptitudeScore: {
    type: Number,
    required: true
  },
  gdScore: {
    type: Number,
    required: true
  },
  allocatedHRs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HR'
  }],
  personalReport: [{
    professionalAppearanceAndAttitude: {
      type: Number
    },
    managerialAptitude: {
      type: Number
    },
    generalIntelligenceAndAwareness: {
      type: Number
    },
    technicalKnowledge: {
      type: Number
    },
    communicationSkills: {
      type: Number
    },
    achievementsAndAmbition: {
      type: Number
    },
    selfConfidence: {
      type: Number
    },
    overallScore: {
      type: Number
    },
    strengths: {
      type: String
    },
    pointsToImproveOn: {
      type: String
    },
    comments: {
      type: String
    },
    interviewerName: {
      type: String
    },
    interviewerCompany: {
      type: String
    }
  }]
});

module.exports = mongoose.model('Student', studentSchema);
