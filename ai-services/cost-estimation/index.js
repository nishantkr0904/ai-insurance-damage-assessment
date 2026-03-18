import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 8001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'cost-estimation' });
});

// POST /estimate-cost - Mock cost estimation
app.post('/estimate-cost', (req, res) => {
  const { damage_type, severity_score, vehicle_make, vehicle_model } = req.body;

  console.log(`[Cost Estimation] Estimating for: ${damage_type}, severity: ${severity_score}`);

  // Simulate processing delay
  setTimeout(() => {
    const baseCost = {
      'scratch': 5000,
      'dent': 8000,
      'crack': 12000,
      'broken_part': 15000,
      'paint_damage': 6000
    };

    const base = baseCost[damage_type] || 10000;
    const multiplier = severity_score || 0.5;
    const totalEstimate = Math.round(base * (1 + multiplier));

    const laborCost = Math.round(totalEstimate * 0.35);
    const partsCost = Math.round(totalEstimate * 0.45);
    const paintCost = Math.round(totalEstimate * 0.20);

    res.json({
      estimatedRepairCost: totalEstimate,
      laborCost,
      partsCost,
      paintCost
    });
  }, 300);
});

app.listen(PORT, () => {
  console.log(`[Mock] Cost Estimation Service running on http://localhost:${PORT}`);
});
