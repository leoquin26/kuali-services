const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a la base de datos "servicio1" (única DB para todo)
const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/servicio1';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Service 3 backend connected to MongoDB (servicio1)'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Modelo para candidatos (colección "applications")
const candidateSchema = new mongoose.Schema({}, { strict: false, collection: 'applications' });
const Candidate = mongoose.model('Candidate', candidateSchema, 'applications');

// Modelo para análisis (colección "analysis_results")
const analysisSchema = new mongoose.Schema({}, { strict: false, collection: 'analysis_results' });
const Analysis = mongoose.model('Analysis', analysisSchema, 'analysis_results');

// Función para extraer el puntaje desde el análisis (en caso de que no se haya almacenado)
function extractScore(analysisText) {
  const match = analysisText.match(/Puntaje:\s*(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

// Endpoint para obtener resultados combinados, ordenados de mayor a menor puntaje
app.get('/api/results', async (req, res) => {
  try {
    // Obtener todos los candidatos desde "applications"
    const candidates = await Candidate.find({});
    // Para cada candidato, buscar su análisis en "analysis_results"
    const results = await Promise.all(candidates.map(async candidate => {
      const analysisRecord = await Analysis.findOne({ candidate_id: candidate._id.toString() });
      let analysisText = "";
      let score = 0;
      if (analysisRecord) {
        analysisText = analysisRecord.analysis || "";
        // Si existe un score guardado, lo usamos; de lo contrario, lo extraemos del texto.
        score = analysisRecord.score || extractScore(analysisText);
      }
      return {
        _id: candidate._id,
        nombres: candidate.nombres,
        telefono: candidate.telefono,
        analysis: analysisText,
        score: score
      };
    }));

    // Ordenar de mayor a menor puntaje
    results.sort((a, b) => b.score - a.score);

    res.json(results);
  } catch (err) {
    console.error("Error in /api/results:", err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Service 3 backend listening on port ${PORT}`));
