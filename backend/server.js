const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
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

// Rate limiting — max 30 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Too many requests, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

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