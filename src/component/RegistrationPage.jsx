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

const RegistrationPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Le password non corrispondono.");
            setLoading(false);
            return;
        }
        const registrationData = {
            username: username,
            email: email,
            password: password,
            roles: ["ROLE_USER"] 
        };

        try {
            const response = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                const responseText = await response.text();
                let message = "Registrazione avvenuta con successo! Ora puoi effettuare il login.";

                try {
                    const data = JSON.parse(responseText);
                    message = data.message || message;
                } catch (jsonError) {
                    message = responseText || message;
                }

                setSuccessMessage(message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const errorText = await response.text();
                let errorMessage = "Errore durante la registrazione. Riprova.";

                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonParseError) {
                   errorMessage = errorText || errorMessage;
                }
                setError(errorMessage);
            }
        } catch (err) {
            console.error("Errore di rete o di fetch:", err);
            setError("Si è verificato un errore di rete. Controlla la tua connessione o riprova più tardi.");
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

                                <h2 className="text-center mb-4">Registrazione Utente</h2>
                                <Form onSubmit={handleSubmit}>
                                    {successMessage && <Alert variant="success">{successMessage}</Alert>}
                                    {error && <Alert variant="danger">{error}</Alert>}

                                    <Form.Group className="mb-3" controlId="formUsername">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Inserisci username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            minLength="5"
                                            maxLength="30"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            type="email"
                                            placeholder="Inserisci email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
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
                                            minLength="8"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formConfirmPassword">
                                        <Form.Label>Conferma Password</Form.Label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Conferma password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </Form.Group>

                                    <Button variant="dark" type="submit" className="w-100" disabled={loading}>
                                        {loading ? 'Registrazione in corso...' : 'Registrati'}
                                    </Button>
                                </Form>
                                <p className="mt-3 text-center">
                                    Hai già un account? <Link to="/login">Accedi qui</Link>
                                </p>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default RegistrationPage;