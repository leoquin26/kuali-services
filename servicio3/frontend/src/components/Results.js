import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Alert,
  Box
} from '@mui/material';

function Results() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/results');
      setResults(response.data);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Error al obtener los resultados.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: 4 }}>
      <Paper elevation={3} sx={{ padding: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Resultados de Candidatos
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {results.length === 0 ? (
          <Typography align="center">No se encontraron resultados.</Typography>
        ) : (
          <Box sx={{ overflowX: 'auto', width: '100%' }}>
            <Table sx={{ minWidth: '100%' }}>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Teléfono</strong></TableCell>
                  <TableCell align="right"><strong>Puntaje</strong></TableCell>
                  <TableCell><strong>Análisis</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map(result => (
                  <TableRow key={result._id}>
                    <TableCell>{result.nombres}</TableCell>
                    <TableCell>{result.telefono}</TableCell>
                    <TableCell align="right">{result.score}</TableCell>
                    <TableCell>{result.analysis}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default Results;
