const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const { searchMedicine } = require('./controllers/medicineController');

const req = { query: { name: 'dolo 650' } };
const res = {
  json: (data) => {
    console.log(`From cache: ${data.fromCache}`);
    console.log(`Total results: ${data.totalResults}`);
    console.log('AI Analysis:', JSON.stringify(data.aiAnalysis, null, 2));
  },
  status: (code) => ({ json: (data) => console.log('Error:', code, data) })
};

const run = async () => {
  await connectDB();

  console.time('Total time');
  await searchMedicine(req, res);
  console.timeEnd('Total time');

  process.exit(0);
};

run();