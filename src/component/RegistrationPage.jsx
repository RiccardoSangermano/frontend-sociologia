import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

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
            ruoli: ["ROLE_USERS"] 
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
        <Container style={{ maxWidth: '500px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
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
                     <Form.Text className="text-muted">Min. 5, Max. 30 caratteri.</Form.Text>
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
                     <Form.Text className="text-muted">Min. 8 caratteri.</Form.Text>
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

                <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                    {loading ? 'Registrazione in corso...' : 'Registrati'}
                </Button>
            </Form>
            <p className="mt-3 text-center">
                Hai già un account? <Link to="/login">Accedi qui</Link>
            </p>
        </Container>
    );
};

export default RegistrationPage;