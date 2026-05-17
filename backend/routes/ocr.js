const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { extractMedicinesFromPrescription } = require('../services/ocrService');

// Store uploaded files temporarily
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPG and PNG images are allowed'));
    }
  }
});

router.post('/extract', upload.single('prescription'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  try {
    console.log('Processing prescription:', req.file.path);
    const medicines = await extractMedicinesFromPrescription(req.file.path);

    // Delete temp file after processing
    fs.unlinkSync(req.file.path);

    if (medicines.length === 0) {
      return res.json({ medicines: [], message: 'No medicines found in image' });
    }

    console.log('Medicines found:', medicines);
    return res.json({ medicines });

  } catch (error) {
    // Clean up temp file on error
    if (req.file) fs.unlinkSync(req.file.path);
    console.error('OCR route error:', error.message);
    return res.status(500).json({ error: 'Failed to process prescription' });
  }
});

module.exports = router;