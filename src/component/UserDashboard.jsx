import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  
  Button,
  Navbar,
  Nav,
  Offcanvas,
  Spinner,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBook, FaCog, FaSignOutAlt, FaGlobe, FaBars, FaUserCircle } from 'react-icons/fa';
import TheoryList from './TheoryList.jsx';
import SearchBar from './SearchBar.jsx';
import '../assets/UserDashboardStyles.css';
import AppFooter from '../component/AppFooter.jsx'; 

const UserNavLinks = ({ handleClose, onLogout }) => (
  <>
   <Nav.Link as={Link} to="/user/my-theories" className="text-light">
      <FaBook className="me-2" /> Le Mie Teorie
    </Nav.Link>
    <hr className="w-100 text-secondary" />
    <Nav.Link className="text-light" onClick={() => { handleClose && handleClose(); onLogout(); }}>
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

const UserDashboard = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);
  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

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
    const fetchUserData = async () => {
      setUserLoading(true);
      setUserError(null);
      const token = sessionStorage.getItem('token');

      if (!token) {
        console.warn("Nessun token di autenticazione trovato. Reindirizzamento al login.");
        setUserError("Utente non autenticato. Effettua il login.");
        setUserLoading(false);
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
          throw new Error(`Errore nel caricamento del profilo: ${userProfileResponse.status} - ${userProfileResponse.statusText}`);
        }

        const userDataFromApi = await userProfileResponse.json();
        console.log("Dati utente ricevuti:", userDataFromApi);

        setUserData({
          username: userDataFromApi.username || userDataFromApi.nomeUtente || userDataFromApi.name || "N/A",
          email: userDataFromApi.email || userDataFromApi.indirizzoEmail || userDataFromApi.mail || "N/A"
        });

      } catch (err) {
        console.error("Errore nel recupero dei dati utente:", err);
        if (err.message !== "unauthorized") {
          setUserError(err.message || "Impossibile caricare i dati utente. Riprova più tardi.");
        }
        setUserData({ username: "Errore", email: "Errore" });
      } finally {
        setUserLoading(false);
      }
    };

    fetchUserData();
  }, [handleLogout]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      setSearchLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_BASE_URL}/theories?keyword=${encodeURIComponent(searchTerm)}`, {
          headers: headers
        });

        if (!response.ok) {
          console.error(`Errore HTTP per suggerimenti: ${response.status} - ${response.statusText}`);
          if (response.status === 401 || response.status === 403) {
            handleLogout();
            throw new Error("Sessione scaduta o non autorizzata per i suggerimenti.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSuggestions(data.content.map(theory => theory.nomeTeoria));
      } catch (err) {
        console.error("Errore nel recupero dei suggerimenti:", err);
        setSuggestions([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const debounceTimeout = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, handleLogout]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    navigate(`/theories/${suggestion}`);
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
          
          <SearchBar 
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            suggestions={suggestions}
            onSelectSuggestion={handleSelectSuggestion}
            loading={searchLoading}
          />
        </Navbar>

        <Navbar expand="lg" className="bg-dark border-bottom border-secondary d-lg-none">
          <Container fluid className="justify-content-between">
            <Button variant="outline-secondary" onClick={handleShowOffcanvas} className="me-2">
              <FaBars className="text-light" />
            </Button>
            <Navbar.Brand as={Link} to="/user-dashboard" className="text-light align-self-center">
              <FaGlobe size={30} />
            </Navbar.Brand>
            <SearchBar 
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              suggestions={suggestions}
              onSelectSuggestion={handleSelectSuggestion}
              loading={searchLoading}
            />
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
        
        <div className="p-4 flex-grow-1 user-dashboard-content-background">
          <div className="overlay"></div>
            <div className="content-wrapper">
                <h1 className="text-light">Benvenuto nella tua Dashboard!</h1>
                <p className="text-light">Qui puoi gestire le tue teorie e il tuo profilo.</p>
                <TheoryList searchTerm={searchTerm} /> 
            </div>
        </div>
        <AppFooter /> 
      </div>
    </div>
  );
};

export default UserDashboard;
