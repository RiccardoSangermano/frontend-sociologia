import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Img from 'react-bootstrap/Image';
import { FaGlobe } from 'react-icons/fa';
import "../assets/Form.css";

const LoginPage = () => {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const loginData = {
            usernameOrEmail: usernameOrEmail,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                sessionStorage.setItem('token', data.accessToken);
                sessionStorage.setItem('roles', JSON.stringify(data.roles));
                
                console.log("Token salvato:", data.accessToken);
                console.log("Ruoli salvati:", data.roles);

                if (data.roles.includes("ROLE_ADMIN")) {
                    navigate("/admin-dashboard");
                } else if (data.roles.includes("ROLE_USER")) {
                    navigate("/user-dashboard");
                } else {
                    navigate('/'); 
                }

            } else {
                const errorData = await response.json();
                setError(errorData.message || "Credenziali non valide. Riprova.");
                console.error("Errore di login:", errorData);
            }
        } catch (err) {
            console.error("Errore di rete o di fetch:", err);
            setError("Si è verificato un errore di rete. Controlla la tua connessione.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-body-tertiary text-light min-vh-100 d-flex flex-column" data-bs-theme="dark">
            <Container fluid className="flex-grow-1 p-0 d-flex">
                <Row className="flex-grow-1 w-100 g-0">
                    <Col md={6} className="d-none d-md-block p-0 auth-image-column">
                        <Img
                            src="/images/sociologia.jpg"
                            alt="Immagine di Sociologia"
                            className="w-100 h-100"
                            style={{ objectFit: 'cover' }}
                        />
                    </Col>

                    <Col md={6} className="d-flex justify-content-center align-items-center">
                        <div className="auth-page-container"> 
                            <div className="auth-form-content">
                                <Link to="/" className="text-decoration-none text-light mb-4 d-flex justify-content-center">
                                    <h1 className="mb-0">
                                        <FaGlobe size={40} className="me-2" /> Sociopedika
                                    </h1>
                                </Link>

                                <h2 className="text-center mb-4">Login Utente</h2>
                                <Form onSubmit={handleSubmit}>
                                    {error && <Alert variant="danger">{error}</Alert>}

                                    <Form.Group className="mb-3" controlId="formUsernameOrEmail">
                                        <Form.Label>Username o Email</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Inserisci username o email"
                                            value={usernameOrEmail}
                                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Inserisci password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="dark" type="submit" className="w-100" disabled={loading}>
                                        {loading ? 'Accesso in corso...' : 'Accedi'}
                                    </Button>
                                </Form>
                                <p className="mt-3 text-center">
                                    Non hai un account? <Link to="/register">Registrati qui</Link>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LoginPage;