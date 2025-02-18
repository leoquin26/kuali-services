import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa desde 'react-dom/client'
import "react-mde/lib/styles/css/react-mde-all.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
