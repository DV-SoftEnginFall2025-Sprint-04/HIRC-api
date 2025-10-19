require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { computeRisk } = require('./risk-engine');
const { validatePayload } = require('./validators');

const app = express();
const PORT = process.env.PORT || 5000;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

app.use(express.json());
app.use(cors({
  origin: ALLOWED_ORIGIN === '*' ? true : ALLOWED_ORIGIN,
}));

// wake up server endpoint
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// calculation endpoint
app.post('/api/risk', (req, res) => {
  const { valid, message } = validatePayload(req.body);
  if (!valid) {
    return res.status(400).json({ message });
  }

  try {
    const result = computeRisk(req.body);
    res.json(result);
  } catch (err) {
    console.error('Risk compute failed:', err);
    res.status(500).json({ message: 'Internal error computing risk.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ API running at http://localhost:${PORT}`);
  console.log(`CORS allowed origin: ${ALLOWED_ORIGIN}`);
});
