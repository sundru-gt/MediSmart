const JanAushadhi = require('../models/JanAushadhi');

const findJanAushadhiAlternative = async (medicineName, activeSalt) => {
  try {
    const searchTerm = activeSalt && activeSalt !== 'Unknown' ? activeSalt : medicineName;

    const parts = searchTerm.toLowerCase().split(' ');
    const saltWord = parts.find(w => w.length > 3 && isNaN(w));
    const doseWord = parts.find(w => !isNaN(parseInt(w)));

    if (!saltWord) return null;

    const allMatches = await JanAushadhi.find({
      genericName: { $regex: saltWord, $options: 'i' }
    }).sort({ mrp: 1 });

    if (!allMatches.length) return null;

    // Filter pure single-ingredient medicines
    // Combinations use: "and", ",", "+"
    const pureMatches = allMatches.filter(m => {
      const name = m.genericName.toLowerCase();
      return (
        !name.includes(' and ') &&
        !name.includes(',') &&
        !name.includes('+') &&
        !name.includes('&')
      );
    });

    if (pureMatches.length > 0) {
      // Try to match dosage
      if (doseWord) {
        // Remove spaces around dose — "500 mg" → "500mg" for comparison
        const doseMatch = pureMatches.find(m => {
          const normalizedName = m.genericName.toLowerCase().replace(/\s+/g, '');
          const normalizedDose = doseWord.replace(/\s+/g, '');
          return normalizedName.includes(normalizedDose);
        });
        if (doseMatch) return doseMatch;
      }
      // Return cheapest pure match
      return pureMatches[0];
    }

    return allMatches[0];

  } catch (error) {
    console.error('Jan Aushadhi service error:', error.message);
    return null;
  }
};

module.exports = { findJanAushadhiAlternative };