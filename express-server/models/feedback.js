const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  Question: {
    type: String,
    required: true
  },
  Answer: {
    type: String,
    required: true
  },
  STAR: {
    type: String,
    required: true
  },
  Relevance: {
    type: String,
    required: true
  },
  Professionalism: {
    type: String,
    required: true
  },
  Total_Feedback: {
    type: String,
    required: true
  },
  Scores: {
    type: Object,
    required: true
  },
  Result: {
    type: String,
    required: true
  },
});

const FeedbackModel = mongoose.model('Feedback', FeedbackSchema);

module.exports = FeedbackModel;