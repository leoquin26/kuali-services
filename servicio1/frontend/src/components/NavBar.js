import React from 'react';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1 }}
          component={Link}
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          Kuali Services
        </Typography>
        <Button color="inherit" component={Link} to="/">
          Registro de Candidatos
        </Button>
        <Button color="inherit" component={Link} to="/results">
          Ver Candidatos
        </Button>
        {/* Botón para redireccionar al frontend del Servicio 3 */}
        <Button
          color="inherit"
          component="a"
          href="http://localhost:3003"
          rel="noopener noreferrer"
        >
          Lista de resultados
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
