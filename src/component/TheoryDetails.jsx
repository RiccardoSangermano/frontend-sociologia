import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Spinner,
  Alert,
  Modal, 
  Navbar, 
  Nav 
} from 'react-bootstrap';
import { FaUserCircle, FaGlobe, FaBook } from 'react-icons/fa'; 
import AppFooter from '../component/AppFooter.jsx'; 
import '../assets/UserDashboardStyles.css'; 

const TheoryDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 

  const [theory, setTheory] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isFavorite, setIsFavorite] = useState(false); 

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');

  const handleShowModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('token'); 
    sessionStorage.removeItem('roles'); 
    navigate('/login'); 
  }, [navigate]); 

  useEffect(() => {
    const fetchTheoryAndFavoriteStatus = async () => {
      setLoading(true); 
      setError(null); 

      const token = sessionStorage.getItem('token'); 

      try {
        const theoryResponse = await fetch(`${API_BASE_URL}/theories/${id}`);
        if (!theoryResponse.ok) {
          if (theoryResponse.status === 404) {
              throw new Error("Teoria non trovata."); 
          }
          throw new Error(`Errore HTTP: ${theoryResponse.status} - ${theoryResponse.statusText}`); 
        }
        const theoryData = await theoryResponse.json(); 
        setTheory(theoryData); 

        if (token) {
          const userProfileResponse = await fetch(`${API_BASE_URL}/utenti/me`, {
            headers: { 'Authorization': `Bearer ${token}` } 
          });

          if (!userProfileResponse.ok) {
            console.error(`Errore HTTP nel recupero profilo utente: ${userProfileResponse.status} - ${userProfileResponse.statusText}`);
            if (userProfileResponse.status === 401 || userProfileResponse.status === 403) {
                handleLogout(); 
                throw new Error("Sessione scaduta o non autorizzata. Effettua nuovamente il login.");
            }
            throw new Error("Impossibile caricare il profilo utente.");
          }
          const userDataFromApi = await userProfileResponse.json();
          const isCurrentlyFavorite = userDataFromApi.teoriePreferite.some(favTheory => favTheory.id === theoryData.id);
          setIsFavorite(isCurrentlyFavorite); 
        } else {
          setIsFavorite(false); 
        }

      } catch (err) {
        console.error("Errore nel caricamento dei dettagli della teoria o dello stato preferito:", err);
        if (!err.message.includes("Sessione scaduta") && !err.message.includes("unauthorized")) {
            setError(err.message || "Impossibile caricare i dettagli della teoria. Riprova più tardi.");
        }
      } finally {
        setLoading(false); 
      }
    };

    fetchTheoryAndFavoriteStatus(); 
  }, [id, navigate, handleLogout]); 

  
  const handleToggleFavorite = async () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      handleShowModal("Accesso Richiesto", "Devi essere loggato per salvare o rimuovere teorie dai preferiti.");
      navigate('/login'); 
      return;
    }

    const method = isFavorite ? 'DELETE' : 'POST'; 
    const endpoint = `${API_BASE_URL}/utenti/me/teorie-preferite/${id}`; 

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
      });

      if (response.status === 401) {
        handleShowModal("Sessione Scaduta", "Sessione scaduta o non autorizzata. Effettua nuovamente il login.");
        handleLogout(); 
        return;
      }

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json(); 
        } catch (jsonError) {
          errorData = { message: `Errore HTTP: ${response.status} - ${response.statusText || 'Errore sconosciuto dal server.'}` };
        }
        throw new Error(errorData.message || `Errore nella ${isFavorite ? 'rimozione' : 'aggiunta'} della teoria dai preferiti.`);
      }

      setIsFavorite(!isFavorite); 
      handleShowModal("Successo", `Teoria ${isFavorite ? 'rimossa' : 'aggiunta'} ai preferiti!`); 

    } catch (err) {
      console.error(`Errore durante ${method} di preferiti:`, err);
      handleShowModal("Errore", `Impossibile ${isFavorite ? 'rimuovere' : 'salvare'} la teoria: ${err.message}`); 
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary" data-bs-theme="dark">
    <Navbar className="bg-dark border-bottom border-secondary py-3">
        <Container fluid className="justify-content-between align-items-center">
          <Nav className="d-none d-md-flex"></Nav> 
          <Navbar.Brand as={Link} to="/user-dashboard" className="text-light mx-auto">
            <FaGlobe size={30} />
          </Navbar.Brand>
          <Nav>
            <Nav.Link as={Link} to="/user/my-theories" className="text-light">
              <FaBook className="me-2" /> Preferiti
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <div className="p-4 flex-grow-1 user-dashboard-content-background">
        <div className="overlay"></div> 
        <div className="content-wrapper"> 
          {loading && (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <Spinner animation="border" role="status" className="text-light">
                <span className="visually-hidden">Caricamento...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <div className="container mt-5 text-center flex-grow-1 d-flex align-items-center justify-content-center">
              <Alert variant="danger" role="alert" className="w-75">{error}</Alert>
            </div>
          )}

          {(!theory && !loading && !error) && (
            <div className="container mt-5 text-center flex-grow-1 d-flex align-items-center justify-content-center">
              <Alert variant="warning" role="alert" className="w-75">Teoria non trovata.</Alert>
            </div>
          )}

          {theory && (
            <Container className="my-5 flex-grow-1">
              <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                  <div className="card shadow-sm bg-dark text-light border-secondary">
                    <div className="card-body">
                      <h2 className="card-title text-center mb-4 text-light">{theory.nomeTeoria}</h2>

                      <div className="d-flex flex-column align-items-center mb-4">
                        {theory.immagineAutoreUrl && (
                          <div className="author-image-container mb-3">
                            <img
                              src={theory.immagineAutoreUrl}
                              alt={`Immagine di ${theory.autore}`}
                              className="img-fluid rounded-circle border border-light"
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                          </div>
                        )}
                        <p className="card-text text-light"><strong>Autore:</strong> {theory.autore}</p>
                      </div>

                      <hr className="border-secondary" />

                      <div className="mt-4">
                        <h3 className="card-subtitle mb-2 text-white">Spiegazione:</h3>
                        <p className="card-text">{theory.spiegazione}</p>
                      </div>

                      {theory.esempioApplicazioneModerna && (
                        <div className="mt-4">
                          <h4 className="card-subtitle mb-2 text-white">Esempio di Applicazione Moderna:</h4>
                          <p className="card-text">{theory.esempioApplicazioneModerna}</p>
                        </div>
                      )}
                    </div>
                    <div className="card-footer text-center bg-dark border-top border-secondary d-flex justify-content-center gap-3">
                      <Button variant="outline-secondary" onClick={() => navigate(-1)}>
                        Indietro
                      </Button>
                      <Button
                        variant={isFavorite ? 'danger' : 'outline-success'}
                        onClick={handleToggleFavorite}
                      >
                        {isFavorite ? 'Rimuovi dai Preferiti' : 'Aggiungi ai Preferiti'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          )}
        </div>
      </div>
      <AppFooter />

      <Modal show={showModal} onHide={handleCloseModal} centered data-bs-theme="dark">
        <Modal.Header closeButton closeVariant="white" className="bg-dark border-secondary">
          <Modal.Title className="text-light">{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-body-tertiary text-light">
          <p>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer className="bg-dark border-secondary">
          <Button variant="secondary" onClick={handleCloseModal}>
            Chiudi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TheoryDetails;
