import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Spinner,
  Alert,
  Card
} from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: [],
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/utenti', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Errore nel caricamento degli utenti');
      }
      const data = await response.json();
      setUsers(data || []);
      console.log("Dati utenti ricevuti (da fetchUsers):", data);
    } catch (err) {
      console.error("fetchUsers error:", err);
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleShowModal = (user = null) => {
    setEditingUser(user);
    setFormData({
      username: user ? user.username : '',
      email: user ? user.email : '',
      password: '',
      roles: user && Array.isArray(user.ruoli) ? [...user.ruoli] : [],
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ username: '', email: '', password: '', roles: [] });
    setError(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const token = sessionStorage.getItem('token');
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser
      ? `http://localhost:8080/api/utenti/${editingUser.id}`
      : 'http://localhost:8080/api/utenti';

    const payload = { ...formData };
    if (editingUser && formData.password === '') {
      delete payload.password;
    }
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Operazione fallita. Controlla i dati.');
      }

      await fetchUsers();
      handleCloseModal();
    } catch (err) {
      console.error("handleFormSubmit error:", err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Sei sicuro di voler eliminare questo utente?')) {
      setError(null);
      try {
        const token = sessionStorage.getItem('token');
        const response = await fetch(
          `http://localhost:8080/api/utenti/${userId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Errore durante l\'eliminazione dell\'utente.');
        }

        await fetchUsers();
        } 
      catch (err) {
        console.error("handleDeleteUser error:", err);
        setError(err.message);
      }
    }
  };

  return (
    <div className="p-4 flex-grow-1">
      <Container fluid>
        <Row className="mb-4 align-items-center">
          <Col className="text-center text-light">
            <h2>Gestione Utenti</h2>
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

        <div className="p-4 rounded-3 shadow-sm bg-dark text-light">
          {loading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" role="status" className="text-light" />
              <p className="text-light">Caricamento...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center mt-5 text-light">Nessun utente trovato.</div>
          ) : (
            <Row xs={1} md={2} lg={3} xl={4} className="g-4">
              {users?.map((user) => (
                <Col key={user.id}>
                  <Card className="h-100 bg-dark text-light shadow"> 
                    <Card.Body>
                      <Card.Title className="text-white">{user.username}</Card.Title>
                      <Card.Text>
                        <strong>ID:</strong> {user.id}<br />
                        <strong>Email:</strong> {user.email}<br />
                        <strong>Ruoli:</strong>{' '}
                        {user.ruoli?.map((roleString, index) => (
                          <span key={roleString + index} className="badge bg-info me-1">
                            {roleString.replace('ROLE_', '')}
                          </span>
                        ))}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end gap-2 bg-dark border-top border-secondary">
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleShowModal(user)}
                      >
                        <FaEdit /> Modifica
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FaTrash /> Elimina
                      </Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </Container>

      <Modal show={showModal} onHide={handleCloseModal} data-bs-theme="dark">
        <Modal.Header closeButton closeVariant="white" className="bg-dark text-light border-secondary">
          <Modal.Title className="text-light">
            {editingUser ? 'Modifica Utente' : 'Aggiungi Nuovo Utente'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-light"> 
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                required
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                required
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                {editingUser ? 'Nuova Password (lascia vuoto per non modificare)' : 'Password'}
              </Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                required={!editingUser}
                className="bg-dark text-light border-secondary"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ruolo</Form.Label>
              <Form.Control
                as="select"
                name="roles"
                value={formData.roles.length > 0 ? formData.roles[0] : ''}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    roles: e.target.value ? [e.target.value] : []
                  });
                }}
                required
                className="bg-dark text-light border-secondary"
              >
                <option value="">Seleziona un ruolo</option>
                <option value="ROLE_USER">Utente Standard</option>
                <option value="ROLE_ADMIN">Amministratore</option>
              </Form.Control>
            </Form.Group>
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
            <Button variant="primary" type="submit" className="w-100 mt-3">
              Salva
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagement;
