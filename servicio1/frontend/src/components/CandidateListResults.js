import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Modal,
  CircularProgress,
  Alert
} from '@mui/material';

function CandidateListResults() {
  const [candidates, setCandidates] = useState([]);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [loadingCandidateId, setLoadingCandidateId] = useState(null);
  // Estado para opciones del modal: si ya existe análisis, ID y modo de visualización
  const [modalOptions, setModalOptions] = useState({ exists: false, candidateId: null, viewMode: false });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/applications');
      setCandidates(response.data);
    } catch (error) {
      console.error("Error al obtener candidatos:", error);
      setError('Error al obtener la lista de candidatos.');
    }
  };

  // Verificar si ya existe un análisis para un candidato
  const checkExistingAnalysis = async (candidateId) => {
    try {
      const response = await axios.get(`http://localhost:5001/analysis/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error("Error al verificar análisis:", error);
      return { exists: false };
    }
  };

  // Disparar el análisis (o mostrar opciones si ya existe)
  const handleAnalyze = async (candidateId) => {
    setLoadingCandidateId(candidateId);
    try {
      const existing = await checkExistingAnalysis(candidateId);
      if (existing.exists) {
        setAnalysisResult(existing.analysis);
        setModalOptions({ exists: true, candidateId, viewMode: false });
        setOpenModal(true);
      } else {
        const response = await axios.post(`http://localhost:5001/analyze/${candidateId}`);
        setAnalysisResult(response.data.analysis);
        setModalOptions({ exists: false, candidateId, viewMode: true });
        setOpenModal(true);
      }
    } catch (error) {
      console.error("Error al analizar el candidato:", error);
      setAnalysisResult("Error al analizar el candidato.");
      setModalOptions({ exists: false, candidateId, viewMode: true });
      setOpenModal(true);
    } finally {
      setLoadingCandidateId(null);
    }
  };

  // Volver a analizar (actualizar el análisis existente)
  const handleReanalyze = async () => {
    const candidateId = modalOptions.candidateId;
    setLoadingCandidateId(candidateId);
    try {
      const response = await axios.post(`http://localhost:5001/analyze/${candidateId}`);
      setAnalysisResult(response.data.analysis);
      setModalOptions({ exists: false, candidateId, viewMode: true });
    } catch (error) {
      console.error("Error al reanalizar el candidato:", error);
      setAnalysisResult("Error al analizar el candidato.");
    } finally {
      setLoadingCandidateId(null);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
    setAnalysisResult('');
    setModalOptions({ exists: false, candidateId: null, viewMode: false });
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          Lista de Candidatos
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {candidates.length === 0 ? (
          <Typography>No se encontraron candidatos.</Typography>
        ) : (
          <List>
            {candidates.map((candidate) => (
              <ListItem key={candidate._id} divider>
                <ListItemText
                  primary={candidate.nombres}
                  secondary={`Teléfono: ${candidate.telefono}`}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleAnalyze(candidate._id)}
                  disabled={loadingCandidateId === candidate._id}
                >
                  {loadingCandidateId === candidate._id ? <CircularProgress size={24} /> : 'Analizar'}
                </Button>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      <Modal open={openModal} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '80%',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          {modalOptions.exists && !modalOptions.viewMode ? (
            <>
              <Typography variant="h6" component="h2">
                Ya existe un análisis para este candidato.
              </Typography>
              <Typography sx={{ mt: 2 }}>
                ¿Desea mostrar el análisis existente o volver a realizarlo? (Al reanalizar se actualizará el análisis existente)
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button variant="outlined" onClick={() => setModalOptions({ ...modalOptions, viewMode: true })}>
                  Mostrar
                </Button>
                <Button variant="contained" onClick={handleReanalyze}>
                  Volver a realizar
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h6" component="h2">
                Resultado del Análisis
              </Typography>
              <Typography sx={{ mt: 2 }}>
                {analysisResult}
              </Typography>
              <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button variant="contained" onClick={handleClose}>
                  Cerrar
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
}

export default CandidateListResults;
