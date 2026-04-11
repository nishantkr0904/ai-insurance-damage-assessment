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
    let fraudScore = 0;
    const flags = [];

    // Rule 1: Too many images
    if (image_urls?.length > 5) {
      fraudScore += 0.2;
      flags.push('Too many images submitted');
    }

    // Rule 2: Duplicate images (simple check)
    const uniqueImages = new Set(image_urls);
    if (uniqueImages.size !== image_urls.length) {
      fraudScore += 0.3;
      flags.push('Duplicate images detected');
    }

    // Rule 3: Suspicious claim id pattern
    if (claim_id && claim_id.toLowerCase().includes('test')) {
      fraudScore += 0.2;
      flags.push('Suspicious claim pattern');
    }

    // Normalize
    fraudScore = Math.min(fraudScore, 1.0);
    fraudScore = parseFloat(fraudScore.toFixed(2));
    
    let riskLevel = 'low';

    if (fraudScore > 0.6) riskLevel = 'high';
    else if (fraudScore > 0.3) riskLevel = 'medium';

    console.log(`[Fraud Detection] Score: ${fraudScore}, Risk: ${riskLevel}`);

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
