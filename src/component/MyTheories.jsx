import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Button,
  Navbar,
  Nav,
  Offcanvas,
  Spinner,
  Alert,
  Card,
  Row,
  Col
} from 'react-bootstrap';
import { FaUser, FaBook, FaCog, FaSignOutAlt, FaGlobe, FaBars, FaUserCircle, FaTrash } from 'react-icons/fa';
import AppFooter from '../component/AppFooter.jsx';

const UserNavLinks = ({ handleClose = () => {}, onLogout }) => (
  <>
    <Nav.Link as={Link} to="/user/my-theories" className="text-light" onClick={handleClose}>
      <FaBook className="me-2" /> Le Mie Teorie
    </Nav.Link>
    <hr className="w-100 text-secondary" />
    <Nav.Link className="text-light" onClick={() => { handleClose(); onLogout(); }}>
      <FaSignOutAlt className="me-2" /> Esci
    </Nav.Link>
  </>
);


const ProfileSection = ({ username, email }) => (
  <div className="text-center text-light mb-4">
    <FaUserCircle size={50} className="mb-2" />
    <h6>{username}</h6>
    <small>{email}</small>
  </div>
);

const MyTheories = () => {
  const navigate = useNavigate();

  const [favoriteTheories, setFavoriteTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);

  const [userData, setUserData] = useState({ username: "Caricamento...", email: "" });
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState(null);

  const API_BASE_URL = 'http://localhost:8080/api';

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('roles');
    navigate('/login');
  }, [navigate]);

  useEffect(() => {
    const fetchFavoriteTheoriesAndUserData = async () => {
      setLoading(true);
      setError(null);
      setUserLoading(true);
      setUserError(null);

      const token = sessionStorage.getItem('token');

      if (!token) {
        alert("Devi essere loggato per visualizzare le tue teorie preferite.");
        handleLogout();
        return;
      }

      try {
        const userProfileResponse = await fetch(`${API_BASE_URL}/utenti/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!userProfileResponse.ok) {
          console.error(`Errore HTTP nel recupero profilo utente: ${userProfileResponse.status} - ${userProfileResponse.statusText}`);
          if (userProfileResponse.status === 401 || userProfileResponse.status === 403) {
              handleLogout();
              throw new Error("Sessione scaduta o non autorizzata. Effettua nuovamente il login.");
          }
          throw new Error("Impossibile caricare il profilo utente o le teorie preferite.");
        }

        const userDataFromApi = await userProfileResponse.json();
        setUserData({
          username: userDataFromApi.username || userDataFromApi.nomeUtente || userDataFromApi.name || "N/A",
          email: userDataFromApi.email || userDataFromApi.indirizzoEmail || userDataFromApi.mail || "N/A"
        });
        setFavoriteTheories(userDataFromApi.teoriePreferite || []);

      } catch (err) {
        console.error("Errore nel caricamento delle teorie preferite o dei dati utente:", err);
        if (!err.message.includes("Sessione scaduta") && !err.message.includes("unauthorized")) {
            setError(err.message || "Impossibile caricare le tue teorie preferite. Riprova più tardi.");
            setUserError(err.message || "Impossibile caricare i dati utente.");
        }
        setUserData({ username: "Errore", email: "Errore" });
      } finally {
        setLoading(false);
        setUserLoading(false);
      }
    };

    fetchFavoriteTheoriesAndUserData();
  }, [navigate, handleLogout]);

  const handleRemoveFavorite = async (theoryIdToRemove) => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      alert("Devi essere loggato per rimuovere teorie dai preferiti.");
      handleLogout();
      return;
    }

    const confirmRemoval = window.confirm("Sei sicuro di voler rimuovere questa teoria dai tuoi preferiti?");
    if (!confirmRemoval) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/utenti/me/teorie-preferite/${theoryIdToRemove}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      if (response.status === 401) {
        alert("Sessione scaduta o non autorizzata. Effettua nuovamente il login.");
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
        throw new Error(errorData.message || `Errore nella rimozione della teoria dai preferiti.`);
      }

      setFavoriteTheories(prevTheories => prevTheories.filter(theory => theory.id !== theoryIdToRemove));
      alert("Teoria rimossa dai preferiti con successo!");

    } catch (err) {
      console.error("Errore durante la rimozione dai preferiti:", err);
      alert(`Impossibile rimuovere la teoria: ${err.message}`);
    }
  };

  return (
    <div className="d-flex min-vh-100" data-bs-theme="dark">
      <div className="d-none d-lg-block bg-dark border-end border-secondary p-4" style={{ width: '250px' }}>
        <Navbar.Brand as={Link} to="/user-dashboard" className="text-light text-center d-block mx-auto mb-3">
          <FaGlobe size={40} />
        </Navbar.Brand>
        <hr className="w-100 text-secondary" />

        {userLoading ? (
            <div className="text-center text-light mb-4">
              <Spinner animation="border" size="sm" role="status" className="me-2" /> Caricamento...
            </div>
        ) : userError ? (
            <div className="text-center text-danger mb-4">{userError}</div>
        ) : (
            <ProfileSection username={userData.username} email={userData.email} />
        )}

        <Nav className="flex-column w-100">
          <UserNavLinks onLogout={handleLogout} />
        </Nav>
      </div>

      <div className="flex-grow-1 d-flex flex-column bg-body-tertiary">
        <Navbar className="bg-dark border-bottom border-secondary d-none d-lg-flex justify-content-between px-3">
          <Navbar.Brand as={Link} to="/user-dashboard" className="text-light mx-auto">
            Sociopedika
          </Navbar.Brand>
        </Navbar>

        <Navbar expand="lg" className="bg-dark border-bottom border-secondary d-lg-none">
          <Container fluid className="justify-content-start">
            <Button variant="outline-secondary" onClick={handleShowOffcanvas} className="me-2">
              <FaBars className="text-light" />
            </Button>
            <Navbar.Brand as={Link} to="/user-dashboard" className="text-light mx-auto">
              <FaGlobe size={30} />
            </Navbar.Brand>
          </Container>
        </Navbar>

        <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} responsive="lg" className="bg-dark text-light d-lg-none">
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            {userLoading ? (
                <div className="text-center text-light mb-4">
                  <Spinner animation="border" size="sm" role="status" className="me-2" /> Caricamento...
                </div>
            ) : userError ? (
                <div className="text-center text-danger mb-4">{userError}</div>
            ) : (
                <ProfileSection username={userData.username} email={userData.email} />
            )}
            <Nav className="flex-column w-100">
              <UserNavLinks handleClose={handleCloseOffcanvas} onLogout={handleLogout} />
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        <div className="p-4 flex-grow-1 d-flex flex-column">
          <Container className="my-5 flex-grow-1">
            <h2 className="text-center mb-4 text-light">Teorie Preferite</h2>

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

            {!loading && !error && favoriteTheories.length === 0 && (
              <div className="container mt-5 text-center flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="w-75 bg-dark text-light p-4 rounded shadow-sm border border-secondary">
                  <p className="lead mb-3">Non hai ancora salvato nessuna teoria tra i preferiti.</p>
                  <Link to="/user-dashboard" className="alert-link text-light">
                    Esplora le teorie disponibili!
                  </Link>
                </div>
              </div>
            )}

            {!loading && !error && favoriteTheories.length > 0 && (
              <Row xs={1} md={2} lg={3} className="g-4 justify-content-center">
                {favoriteTheories.map(theory => (
                  <Col key={theory.id} className="d-flex align-items-stretch">
                    <Card className="shadow-sm bg-dark text-light border-secondary w-100">
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="text-light">{theory.nomeTeoria}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">Autore: {theory.autore}</Card.Subtitle>
                        <Card.Text className="flex-grow-1">
                          {theory.spiegazione.substring(0, 150)}...
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <Button
                            variant="outline-primary"
                            as={Link}
                            to={`/theories/${theory.id}`}
                          >
                            Vedi Dettagli
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleRemoveFavorite(theory.id)}
                            title="Rimuovi dai Preferiti"
                          >
                            <FaTrash /> Rimuovi
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default MyTheories;