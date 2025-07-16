import React, { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from './SearchBar.jsx'; 
import TheoryList from './TheoryList.jsx'; 
import { FaGlobe } from 'react-icons/fa';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

const HomePage = () => {
    const navigate = useNavigate(); 
    const [searchTerm, setSearchTerm] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);

    

    const handleSearchTermChange = async (term) => {
        setSearchTerm(term); 
        if (term.length > 2 || term.length === 0) {
            setLoadingSuggestions(true);
            try {
                const response = await fetch(`http://localhost:8080/api/theories?keyword=${encodeURIComponent(term)}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setSuggestions(data.content.map(theory => theory.nomeTeoria));
            } catch (err) {
                console.error("Errore nel recupero dei suggerimenti:", err);
                setSuggestions([]);
            } finally {
                setLoadingSuggestions(false);
            }
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        setSearchTerm(suggestion);
        setSuggestions([]);
    };

    return (
        <div>
            
            <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <FaGlobe className="me-2" />
                        Sociology
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/">Chi siamo?</Nav.Link>
                            <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
                            <Nav.Link as={Link} to="/">Log in</Nav.Link>
                            </Nav>

                       
                        <div className="d-flex me-3">
                            <SearchBar
                                onSearchChange={handleSearchTermChange}
                                suggestions={suggestions}
                                onSelectSuggestion={handleSelectSuggestion}
                                loading={loadingSuggestions}
                            />
                        </div>
                        <Nav>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <div className="container mt-4">
                <Container className="mt-3 text-center">
                    <img
                        src="/images/sociologia.jpg"
                        alt="Immagine di Sociologia"
                        className="img-fluid"
                        style={{ maxWidth: '100%', height: 'auto' }}
                    />
                </Container>

                <h1 className="mt-4 text-center">Benvenuto nella Sociopedia!</h1>
                <p className="text-center mb-4">Esplora le principali teorie sociologiche e scopri il mondo della sociologia.</p>
                <TheoryList searchTerm={searchTerm} />
            </div>
        </div>
    );
};

export default HomePage;