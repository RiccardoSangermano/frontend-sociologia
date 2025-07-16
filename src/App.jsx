import React from 'react';
import { Routes, Route } from 'react-router-dom'; 
import HomePage from './component/HomePage.jsx';         
import TheoryDetail from './component/TheoryDetails.jsx'; 
import RegistrationPage from './component/RegistrationPage.jsx';





function App() {
  return (
    
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/theories/:id" element={<TheoryDetail />} /> 
      <Route path="/about" element={<AboutPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="*" element={<p>404 - Pagina non trovata</p>} />
    </Routes>
  );
}

export default App;