import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { FaGlobe } from 'react-icons/fa';
import '../assets/AppNavbar.css'; 

const AppNavbar = () => {
    return (
        <Navbar expand="lg" className="bg-body-tertiary border-bottom border-secondary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                    <FaGlobe className="me-2 navbar-brand-icon" />
                    <span className="navbar-brand-text">Sociopedika</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/register">Sign up</Nav.Link>
                        <Nav.Link as={Link} to="/login">Log in</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppNavbar;