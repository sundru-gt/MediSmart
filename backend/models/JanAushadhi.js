const mongoose = require('mongoose');

const janAushadhiSchema = new mongoose.Schema({
  drugCode: String,
  genericName: String,
  unitSize: String,
  mrp: Number,
  groupName: String,
});

janAushadhiSchema.index({ genericName: 'text' });

module.exports = mongoose.model('JanAushadhi', janAushadhiSchema);