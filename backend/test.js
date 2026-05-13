const { searchMedicine } = require('./controllers/medicineController');

// Mock req and res
const req = { query: { name: 'paracetamol' } };
const res = {
  json: (data) => console.log('Results:', JSON.stringify(data, null, 2)),
  status: (code) => ({ json: (data) => console.log('Error:', code, data) })
};

searchMedicine(req, res);