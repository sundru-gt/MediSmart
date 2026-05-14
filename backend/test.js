const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
console.log('Key loaded:', process.env.GEMINI_API_KEY ? 'YES' : 'NO');
const { searchMedicine } = require('./controllers/medicineController');

const req = { query: { name: 'dolo 650' } };
const res = {
  json: (data) => {
    console.log('\n=== PRICE RESULTS ===');
    console.log(`Total: ${data.totalResults} results`);
    console.log('\n=== AI ANALYSIS ===');
    console.log(JSON.stringify(data.aiAnalysis, null, 2));
  },
  status: (code) => ({ json: (data) => console.log('Error:', code, data) })
};

searchMedicine(req, res);