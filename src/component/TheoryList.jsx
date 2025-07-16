// src/component/TheoryList.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; 
import Card from 'react-bootstrap/Card'; 
import ListGroup from 'react-bootstrap/ListGroup';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const TheoryList = ({ searchTerm }) => {
  console.log("TheoryList component is rendering!");
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTheories = () => {
    setLoading(true);
    setError(null);

    fetch(`http://localhost:8080/api/theories?keyword=${encodeURIComponent(searchTerm || '')}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("Full API response (data object):", data);
        setTheories(data.content || data || []);
        console.log("'theories' state after setTheories:", data.content || data);
      })
      .catch(err => {
        console.error("Error loading theories:", err);
        setError("Impossibile caricare le teorie. Riprova più tardi.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTheories();
  }, [searchTerm]);

  if (loading) {
    return (
        <div className="text-center mt-5">Caricamento teorie...</div>
    );
  }

  if (error) {
    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={12} md={8} lg={6}>
                    <div className="alert alert-danger text-center" role="alert">
                        {error}
                    </div>
                </Col>
            </Row>
        </Container>
    );
  }

  if (theories.length === 0) {
    return (
        <div className="text-center mt-5">Nessuna teoria trovata che corrisponda alla tua ricerca o nessuna teoria disponibile.</div>
    );
  }

  return (
    <Container className="mt-4">
      <Row xs={1} md={2} lg={3} className="g-4">
        {theories.map(theory => (
          <Col key={theory.id}>
            <Link 
              to={`/theories/${theory.id}`} 
              style={{ textDecoration: 'none', color: 'inherit' }} 
            >
              <Card className="h-100 shadow-sm" style={{ cursor: 'pointer' }}> 
                <Card.Body>
                  <Card.Title>{theory.nomeTeoria}</Card.Title>
                  <Card.Text>
                    {theory.descrizioneBreve || "Nessuna descrizione disponibile."}
                  </Card.Text>
                  </Card.Body>
                <ListGroup className="list-group-flush">
                  <ListGroup.Item>
                    <strong>Autore:</strong> {theory.autore || "Sconosciuto"}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Periodo:</strong> {theory.periodo || "Non specificato"}
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default TheoryList;