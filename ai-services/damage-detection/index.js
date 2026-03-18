import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'damage-detection' });
});

// POST /analyze-damage - Mock damage analysis
app.post('/analyze-damage', (req, res) => {
  const { image_url } = req.body;

  console.log(`[Damage Detection] Analyzing image: ${image_url}`);

  // Simulate processing delay
  setTimeout(() => {
    const damageTypes = ['scratch', 'dent', 'crack', 'broken_part', 'paint_damage'];
    const randomDamageType = damageTypes[Math.floor(Math.random() * damageTypes.length)];
    const severityScore = Math.random() * 0.5 + 0.3; // 0.3 - 0.8

    res.json({
      damageDetected: true,
      damageType: randomDamageType,
      severityScore: parseFloat(severityScore.toFixed(2)),
      boundingBoxes: [
        {
          x: 120,
          y: 80,
          width: 200,
          height: 150,
          label: randomDamageType,
          confidence: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2))
        }
      ],
      confidence: parseFloat((Math.random() * 0.15 + 0.85).toFixed(2))
    });
  }, 500);
});

app.listen(PORT, () => {
  console.log(`[Mock] Damage Detection Service running on http://localhost:${PORT}`);
});
