import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8002;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'fraud-detection' });
});

// POST /fraud-check - Mock fraud detection
app.post('/fraud-check', (req, res) => {
  const { image_urls, claim_id } = req.body;

  console.log(`[Fraud Detection] Checking claim: ${claim_id}, images: ${image_urls?.length || 0}`);

  // Simulate processing delay
  setTimeout(() => {
    const fraudScore = parseFloat((Math.random() * 0.3).toFixed(2)); // Low fraud score 0-0.3
    let riskLevel = 'low';
    const flags = [];

    if (fraudScore > 0.2) {
      riskLevel = 'medium';
      flags.push('Multiple similar claims detected');
    }
    if (fraudScore > 0.25) {
      flags.push('Image metadata inconsistency');
    }

    res.json({
      fraudScore,
      riskLevel,
      flags
    });
  }, 400);
});

app.listen(PORT, () => {
  console.log(`[Mock] Fraud Detection Service running on http://localhost:${PORT}`);
});
