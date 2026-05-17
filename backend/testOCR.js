const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { extractMedicinesFromPrescription } = require('./services/ocrService');

// Test with any prescription image you have
extractMedicinesFromPrescription('./test-prescription.jpg').then(medicines => {
  console.log('Medicines found:', medicines);
});