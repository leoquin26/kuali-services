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
        <Button color="inherit" component={Link} to="http://localhost:3000/">
          Registrar Candidatos
        </Button>
        <Button color="inherit" component="a" href="http://localhost:3000/results">
          Ver Candidatos
        </Button>
        <Button
          color="inherit"
          component="a"
          href="http://localhost:3003"
          rel="noopener noreferrer"
        >
          Lista de Resultados
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
