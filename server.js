const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/analyze', async (req, res) => {
  const { idea, pais, presupuesto, lang } = req.body;
  if (!idea) return res.status(400).json({ error: 'Idea required' });

  const langInstructions = {
    es: { instruction: 'Responde en español.', verdicts: '"VIABLE" | "PARCIALMENTE VIABLE" | "DIFÍCIL"' },
    en: { instruction: 'Respond in English.', verdicts: '"VIABLE" | "PARTIALLY VIABLE" | "DIFFICULT"' },
    it: { instruction: 'Rispondi in italiano.', verdicts: '"FATTIBILE" | "PARZIALMENTE FATTIBILE" | "DIFFICILE"' }
  };

  const l = langInstructions[lang] || langInstructions['es'];

  const prompt = `You are an expert business analyst. Analyze this business idea and respond ONLY with a valid JSON object, no extra text, no markdown, no backticks.

${l.instruction}

Business idea: ${idea}
Target market: ${pais || 'not specified'}
Available budget: ${presupuesto || 'not specified'}

Respond with exactly this JSON structure:
{
  "veredicto": ${l.verdicts},
  "puntuacion": number from 1 to 10,
  "resumen": "2-3 executive sentences about viability",
  "tiempo_primer_ingreso": "realistic estimate e.g.: 3-6 months",
  "coste_arranque": "estimated range e.g.: €2,000 - €8,000",
  "pasos": ["concrete step 1", "step 2", "step 3", "step 4", "step 5"],
  "oportunidades": ["opportunity 1", "opportunity 2", "opportunity 3"],
  "riesgos": ["risk 1", "risk 2", "risk 3"],
  "competidores": ["competitor or alternative 1", "competitor 2", "competitor 3"],
  "consejo_final": "one concrete and direct piece of advice for this specific idea"
}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const data = await response.json();
    const text = data.content.map(i => i.text || '').join('');
    const clean = text.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);
    res.json(result);
  } catch (e) {
    res.status(500).json({ error: 'Analysis error. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Feasible running on port ${PORT}`));

