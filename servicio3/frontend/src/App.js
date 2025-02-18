import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Results from './components/Results';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Results />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;
