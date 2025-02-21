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
  }]
});

module.exports = mongoose.model('Student', studentSchema);
