const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const API_KEY = process.env.ANTHROPIC_API_KEY;

app.post('/analyze', async (req, res) => {
  const { idea, pais, presupuesto } = req.body;

  if (!idea) return res.status(400).json({ error: 'Idea requerida' });

  const prompt = `Eres un analista de negocios experto. Analiza esta idea de negocio y responde SOLO con un objeto JSON válido, sin texto adicional, sin markdown, sin backticks.

Idea: ${idea}
País/mercado: ${pais || 'no especificado'}
Presupuesto disponible: ${presupuesto || 'no especificado'}

Responde exactamente con este JSON:
{
  "veredicto": "VIABLE" | "PARCIALMENTE VIABLE" | "DIFÍCIL",
  "puntuacion": número del 1 al 10,
  "resumen": "2-3 frases ejecutivas sobre la viabilidad",
  "tiempo_primer_ingreso": "estimación realista ej: 3-6 meses",
  "coste_arranque": "rango estimado ej: €2.000 - €8.000",
  "pasos": ["paso 1 concreto", "paso 2", "paso 3", "paso 4", "paso 5"],
  "oportunidades": ["oportunidad 1", "oportunidad 2", "oportunidad 3"],
  "riesgos": ["riesgo 1", "riesgo 2", "riesgo 3"],
  "competidores": ["competidor o alternativa 1", "competidor 2", "competidor 3"],
  "consejo_final": "un consejo concreto y directo para esta idea específica"
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
    res.status(500).json({ error: 'Error al analizar. Inténtalo de nuevo.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Feasible corriendo en puerto ${PORT}`));
