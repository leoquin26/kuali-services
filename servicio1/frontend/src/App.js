import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import CandidateForm from './components/CandidateForm';
import CandidateListResults from './components/CandidateListResults';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<CandidateForm />} />
        <Route path="/results" element={<CandidateListResults />} />
      </Routes>
    </Router>
  );
}

export default App;
