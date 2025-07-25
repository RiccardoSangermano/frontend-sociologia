import React from 'react';
import Container from 'react-bootstrap/Container';
import { BsEmojiFrown } from 'react-icons/bs';
import '../assets/NotFound.css';


const NotFoundPage = () => {
  return (
    <Container 
      fluid
      className="d-flex justify-content-center align-items-center text-center" 
      style={{
        minHeight: '100vh',
        backgroundColor: 'rgba(52, 58, 64, 0.7);  ',
        color: 'white',
      }}
    >
      <div 
        className="p-5" 
        style={{
          border: '1px solid white',
          borderRadius: '8px',
          width: 'fit-content', 
          maxWidth: '80%', 
        }}
      >
        <h1 
          className="d-flex justify-content-center align-items-center"
          style={{ fontSize: '4rem', color: 'white' }} 
        >
          <BsEmojiFrown className="me-3 shake-animation" style={{ fontSize: '4rem', color: 'white' }} /> 404
        </h1>
        <h2 style={{ fontSize: '2.5rem' }}>Oops! Pagina non trovata.</h2> 
        <p>Sembra che la pagina che stai cercando non esista.</p>
        <p>Controlla l'URL o torna alla <a href="/" style={{ color: 'white' }}>home page</a>.</p>
      </div>
    </Container>
  );
};

export default NotFoundPage;