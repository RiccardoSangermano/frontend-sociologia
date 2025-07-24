import React, { useState, useEffect } from 'react';
import {Container,Row,Col,Table,Button,Modal,Form,Spinner,} from 'react-bootstrap';
import {FaEdit,FaTrash,FaPlus,} from 'react-icons/fa';

const TheoryManagement = () => {
  const [theories, setTheories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTheory, setEditingTheory] = useState(null);

  const [formData, setFormData] = useState({
    nomeTeoria: '',
    autore: '',
    immagineAutoreUrl: '',
    spiegazione: '',
    esempioApplicazioneModerna: '',
  });

  const fetchTheories = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/theories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Errore nel caricamento delle teorie');
      }
      const data = await response.json();

      if (Array.isArray(data)) {
        setTheories(data);
      } else if (data && data.content && Array.isArray(data.content)) {
        setTheories(data.content);
      } else {
        console.error("I dati ricevuti dall'API non sono un formato valido:", data);
        setTheories([]);
      }
    } catch (err) {
      setError(err.message);
      setTheories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheories();
  }, []);

  const handleShowModal = (theory = null) => {
    setEditingTheory(theory);
    setFormData({
      nomeTeoria: theory ? theory.nomeTeoria : '',
      autore: theory ? theory.autore : '',
      immagineAutoreUrl: theory ? theory.immagineAutoreUrl : '',
      spiegazione: theory ? theory.spiegazione : '',
      esempioApplicazioneModerna: theory ? theory.esempioApplicazioneModerna : '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTheory(null);
    setFormData({
      nomeTeoria: '',
      autore: '',
      immagineAutoreUrl: '',
      spiegazione: '',
      esempioApplicazioneModerna: '',
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('token');
    const method = editingTheory ? 'PUT' : 'POST';
    const url = editingTheory
      ? `http://localhost:8080/api/theories/${editingTheory.id}`
      : 'http://localhost:8080/api/theories';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Operazione fallita. Controlla i dati.');
      }

      await fetchTheories();
      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTheory = async (theoryId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa teoria?')) {
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(
          `http://localhost:8080/api/theories/${theoryId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Errore durante l\'eliminazione della teoria.');
        }

        await fetchTheories();
      } catch (err) {
        setError(err.message);
      }
    }
  };
  return (
     <div className="p-4 flex-grow-1"> 
      <Container fluid>
        <Row className="mb-4 align-items-center">
          <Col>
          <h2 className="text-light text-center">Gestione Teorie</h2>
          </Col>
          <Col xs="auto">
  
            <Button
              variant="light" 
              className="rounded-circle d-flex align-items-center justify-content-center" 
              style={{
                width: '40px',
                height: '40px', 
                '--bs-btn-hover-bg': '#6c757d', 
                '--bs-btn-hover-border-color': '#6c757d' 
              }}
              onClick={() => handleShowModal()}
            >
              <FaPlus className="text-dark" /> 
            </Button>
          </Col>
        </Row>

        <div className="p-4 rounded-3 shadow-sm">
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status" />
              <p>Caricamento...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : theories.length === 0 ? (
            <div className="text-center mt-5">Nessuna teoria trovata.</div>
          ) : (
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome Teoria</th>
                  <th>Autore</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {theories?.map((theory) => (
                  <tr key={theory.id}>
                    <td>{theory.id}</td>
                    <td>{theory.nomeTeoria}</td>
                    <td>{theory.autore}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShowModal(theory)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteTheory(theory.id)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTheory ? 'Modifica Teoria' : 'Aggiungi Nuova Teoria'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                name="nomeTeoria"
                value={formData.nomeTeoria}
                onChange={handleFormChange}
                placeholder="Nome Teoria"
                required
              />
              <Form.Label>Nome Teoria</Form.Label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                name="autore"
                value={formData.autore}
                onChange={handleFormChange}
                placeholder="Autore"
                required
              />
              <Form.Label>Autore</Form.Label>
            </Form.Floating>
            <Form.Floating className="mb-3">
              <Form.Control
                type="text"
                name="immagineAutoreUrl"
                value={formData.immagineAutoreUrl}
                onChange={handleFormChange}
                placeholder="URL Immagine Autore"
              />
              <Form.Label>URL Immagine Autore</Form.Label>
            </Form.Floating>
            <Form.Group className="mb-3">
              <Form.Label>Spiegazione</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="spiegazione"
                value={formData.spiegazione}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Esempio Applicazione Moderna</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="esempioApplicazioneModerna"
                value={formData.esempioApplicazioneModerna}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TheoryManagement;