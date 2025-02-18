const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  nombres: { type: String, required: true },
  telefono: { type: String, required: true },
  experienciaLaboral: { type: String, required: true },
  estudios: { type: String, required: true },
  cvPath: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);
