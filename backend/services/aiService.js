const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const getSaltAlternatives = async (medicineName, searchResults) => {
  try {
    const prompt = `
You are a pharmaceutical expert. A user searched for "${medicineName}" and got these results from Indian pharmacy websites:

${searchResults.slice(0, 10).map(r => `- ${r.name} (${r.price}) from ${r.source}`).join('\n')}

Your job:
1. Identify the active salt/ingredient in "${medicineName}"
2. From the search results, find medicines with the EXACT same salt and dosage
3. Suggest the cheapest options as better alternatives

Respond in this exact JSON format only, no extra text, no markdown:
{
  "activeSalt": "salt name here",
  "saltDescription": "one line description of what this salt does",
  "alternatives": [
    {
      "name": "medicine name",
      "price": "price",
      "source": "source",
      "confidence": "exact_match",
      "reason": "Same salt, same dosage, different brand"
    }
  ],
  "disclaimer": "This is not medical advice. Please confirm with your pharmacist before switching medicines."
}

Confidence levels:
- "exact_match" = same salt, same dose, different brand
- "same_class" = same salt, different dose
- "consult_doctor" = similar class, different salt
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text;
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return parsed;

  } catch (error) {
    console.error('AI service error:', error.message);
    return {
      activeSalt: 'Unknown',
      saltDescription: 'Could not analyze salt composition',
      alternatives: [],
      disclaimer: 'This is not medical advice. Please confirm with your pharmacist before switching medicines.'
    };
  }
};

module.exports = { getSaltAlternatives };