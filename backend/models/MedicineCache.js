const mongoose = require('mongoose');

const medicineCacheSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  results: {
    type: Array,
    required: true
  },
  aiAnalysis: {
    type: Object,
    required: true
  },
  janAushadhi: {
  type: Object,
  default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 6  // auto-delete after 6 hours
  }
});

module.exports = mongoose.model('MedicineCache', medicineCacheSchema);