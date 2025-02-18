import React, { useState } from 'react';
import axios from 'axios';
import ReactMde from 'react-mde';
import * as Showdown from 'showdown';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Box,
  Button,
  Alert
} from '@mui/material';
import "react-mde/lib/styles/css/react-mde-all.css";

// Configurador para convertir Markdown a HTML
const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
});

function CandidateForm() {
  const [formData, setFormData] = useState({ nombres: '', telefono: '' });
  const [experienciaLaboral, setExperienciaLaboral] = useState('');
  const [estudios, setEstudios] = useState('');
  const [selectedTabExperiencia, setSelectedTabExperiencia] = useState('write');
  const [selectedTabEstudios, setSelectedTabEstudios] = useState('write');
  const [cv, setCv] = useState(null);
  const [message, setMessage] = useState('');
  const [telefonoError, setTelefonoError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setCv(e.target.files[0]);
  };

  const validateTelefono = (telefono) => {
    const re = /^[0-9]+$/;
    return re.test(telefono);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cv) {
      setMessage('Por favor, adjunta tu CV en formato PDF.');
      return;
    }
    if (!validateTelefono(formData.telefono)) {
      setTelefonoError(true);
      setMessage('El teléfono debe contener solo números.');
      return;
    } else {
      setTelefonoError(false);
    }
    const data = new FormData();
    data.append('nombres', formData.nombres);
    data.append('telefono', formData.telefono);
    data.append('experienciaLaboral', experienciaLaboral);
    data.append('estudios', estudios);
    data.append('cv', cv);

    try {
      await axios.post(
        'http://localhost:3001/api/applications',
        data,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage('Postulación enviada exitosamente.');
      // Reiniciar estados
      setFormData({ nombres: '', telefono: '' });
      setExperienciaLaboral('');
      setEstudios('');
      setCv(null);
    } catch (error) {
      console.error('Error al enviar la postulación:', error);
      setMessage('Error al enviar la postulación.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Postulación Laboral
        </Typography>
        {message && (
          <Alert severity="info" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Nombres"
                name="nombres"
                value={formData.nombres}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Teléfono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                required
                error={telefonoError}
                helperText={telefonoError ? 'El teléfono debe contener solo números.' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Experiencia Laboral</Typography>
              <ReactMde
                value={experienciaLaboral}
                onChange={setExperienciaLaboral}
                selectedTab={selectedTabExperiencia}
                onTabChange={setSelectedTabExperiencia}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6">Estudios</Typography>
              <ReactMde
                value={estudios}
                onChange={setEstudios}
                selectedTab={selectedTabEstudios}
                onTabChange={setSelectedTabEstudios}
                generateMarkdownPreview={(markdown) =>
                  Promise.resolve(converter.makeHtml(markdown))
                }
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" component="label" fullWidth>
                Adjuntar CV (PDF)
                <input type="file" accept="application/pdf" hidden onChange={handleFileChange} />
              </Button>
              {cv && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {cv.name}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" type="submit" fullWidth>
                Enviar Postulación
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default CandidateForm;
