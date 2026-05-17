const express = require('express');
const cors = require('cors');
require('dotenv').config({ override: false });

const connectDB = require('./config/db');
const medicineRoutes = require('./routes/medicine');
const ocrRoutes = require('./routes/ocr');

const app = express();
app.use(cors({
  origin: ['https://medi-smart-k71m.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

connectDB();

app.use('/api/medicine', medicineRoutes);
app.use('/api/ocr', ocrRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'MediSmart API running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});