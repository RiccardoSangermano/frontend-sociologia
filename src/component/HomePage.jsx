import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppNavbar from './AppNavbar.jsx';
import AppFooter from './AppFooter.jsx';
import Container from 'react-bootstrap/Container';
import Img from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import '../assets/CustomStyles.css';

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
        navigate(`/theories/${suggestion}`);
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-body-tertiary" data-bs-theme="dark">
            <AppNavbar
                onSearchChange={handleSearchTermChange}
                onSelectSuggestion={handleSelectSuggestion}
                suggestions={suggestions}
                loading={loadingSuggestions}
                searchTerm={searchTerm}
            />

            <div className="flex-grow-1 d-flex flex-column">
                <Container fluid className="flex-grow-1 p-0 d-flex">
                    <Row className="flex-grow-1 w-100 g-0">
                        <Col md={6} className="p-0">
                            <Img
                                src="/images/sociologia.jpg"
                                alt="Immagine di Sociologia"
                                className="w-100 h-100"
                                style={{ objectFit: 'cover' }}
                            />
                        </Col>
                        <Col md={6} className="d-flex justify-content-center align-items-center p-4">
                            <div className="text-center px-md-5 py-md-3">
                                <h1 className="text-light mb-3 display-4">Benvenuto in Sociopedika!</h1>
                                <p className="mb-4 lead text-muted">
                                    L'obiettivo è quello di mostrare le principali teorie sociologiche, cercando di superare lo stazionamento teorico della disciplina e comprendere come diversi meccanismi sociali si presentano nella nostra vita.
                                </p>
                                <p className="mb-4 lead text-muted">
                                    Iscriviti per visualizzare tutte le teorie e immergerti in questo mondo.
                                </p>
                                <Link to="/register">
                                    <Button variant="outline-light" size="lg" className="mt-3 btn-custom-register">
                                        Registrati Ora
                                    </Button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            <AppFooter />
        </div>
    );
};

export default HomePage;