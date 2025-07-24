import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaInstagram, FaFacebook, FaDiscord } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-body-tertiary text-light py-4 border-top border-secondary" data-bs-theme="dark"> 
            <Container>
                <Row className="align-items-center justify-content-between text-center">
                    <Col xs={12} md={4} className="mb-3 mb-md-0 text-md-start">
                        <div className="d-flex justify-content-center justify-content-md-start">
                            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="text-light mx-2 fs-4">
                                <FaInstagram />
                            </a>
                            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="text-light mx-2 fs-4">
                                <FaFacebook />
                            </a>
                            <a href="https://www.discord.com" target="_blank" rel="noopener noreferrer" className="text-light mx-2 fs-4">
                                <FaDiscord />
                            </a>
                        </div>
                    </Col>
                    <Col xs={12} md={4} className="mt-3 mt-md-0 text-md-end">
                        <p className="mb-0 text-muted">
                            &copy; {currentYear} Sociopedika. All rights reserved.
                        </p>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default AppFooter;