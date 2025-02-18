const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const Application = require('./models/Application');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuración de Multer para la subida de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Conexión a MongoDB usando el nombre del servicio definido en Docker Compose (mongo)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/servicio1';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error al conectar con MongoDB:', err));

// Endpoint para recibir la postulación
app.post('/api/applications', upload.single('cv'), async (req, res) => {
  try {
    const { nombres, telefono, experienciaLaboral, estudios } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: 'El archivo CV es obligatorio.' });
    }

    const newApplication = new Application({
      nombres,
      telefono,
      experienciaLaboral,
      estudios,
      cvPath: req.file.path
    });

    await newApplication.save();
    res.status(201).json({ message: 'Postulación enviada exitosamente', application: newApplication });
  } catch (error) {
    console.error('Error al guardar la postulación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/api/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Arrancar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
