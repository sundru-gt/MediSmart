require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const JanAushadhi = require('../models/JanAushadhi');

const parseCSV = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8').replace(/^\uFEFF/, '');
  const lines = content.split('\n').filter(l => l.trim());
  const headers = lines[0].replace(/"/g, '').split(',');

  return lines.slice(1).map(line => {
    const values = line.match(/(".*?"|[^,]+)/g) || [];
    const obj = {};
    headers.forEach((h, i) => {
      obj[h.trim()] = values[i]?.replace(/"/g, '').trim() || '';
    });
    return obj;
  });
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');

  await JanAushadhi.deleteMany({});
  console.log('Cleared existing data');

  const csvPath = path.join(__dirname, '../Product_List_26_5_2026___23_29_48.csv');
  const data = parseCSV(csvPath);

  const medicines = data.map(row => ({
    drugCode: row['Drug Code'],
    genericName: row['Generic Name'],
    unitSize: row['Unit Size'],
    mrp: parseFloat(row['MRP']) || 0,
    groupName: row['Group Name'],
  }));

  await JanAushadhi.insertMany(medicines);
  console.log(`✅ Imported ${medicines.length} Jan Aushadhi medicines`);

  await mongoose.disconnect();
  process.exit(0);
};

run();