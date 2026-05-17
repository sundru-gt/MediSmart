const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const extractMedicinesFromPrescription = async (imagePath) => {
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');

    const ext = path.extname(imagePath).toLowerCase();
    const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType,
                data: base64Image,
              },
            },
            {
              text: `You are a medical prescription reader. Look at this prescription image and extract all medicine names.

Return ONLY a JSON array of medicine names, nothing else, no markdown:
["medicine1", "medicine2", "medicine3"]

Rules:
- Only include medicine/drug names, not dosage instructions
- Include brand names as written on prescription
- If no medicines found, return empty array: []
- Maximum 5 medicines`,
            },
          ],
        },
      ],
    });

    const text = response.text;
    const clean = text.replace(/```json|```/g, '').trim();
    const medicines = JSON.parse(clean);
    return medicines;

  } catch (error) {
    console.error('OCR service error:', error.message);
    return [];
  }
};

module.exports = { extractMedicinesFromPrescription };