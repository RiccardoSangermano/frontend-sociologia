import React, { useState } from 'react';
import { Navbar, Nav, Offcanvas, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaUser, FaBook, FaCog, FaSignOutAlt, FaGlobe, FaBars, FaUserCircle } from 'react-icons/fa';
import TheoryManagement from './TheoryManagement'; 
import UserManagement from './UserManagement';

const NavLinks = ({ handleClose }) => (
  <>
   <hr className="w-100 text-secondary" />
    <Nav.Link as={Link} to="/login" className="text-light" onClick={handleClose}>
      <FaSignOutAlt className="me-2" /> Esci
    </Nav.Link>
  </>
);

const ProfileSection = ({ username, email }) => (
  <div className="text-center text-light mb-4">
    <FaUserCircle size={50} className="mb-2" />
    <h6>{username}</h6>
    <small>{email}</small>
  </div>
);

const AdminDashboard = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const adminData = {
    username: "admin",
    email: "admin@example.com"
  };

  return (
    <div className="d-flex min-vh-100" data-bs-theme="dark">
      <div className="d-none d-lg-block bg-dark border-end border-secondary p-4" style={{ width: '250px' }}>
        <Navbar.Brand as={Link} to="/admin-dashboard" className="text-light text-center d-block mx-auto mb-3">
          <FaGlobe size={40} />
        </Navbar.Brand>
        <hr className="w-100 text-secondary" />
        
        <ProfileSection username={adminData.username} email={adminData.email} />
        
        <Nav className="flex-column w-100">
          <NavLinks />
        </Nav>
      </div>

      <div className="flex-grow-1 d-flex flex-column bg-body-tertiary">
        <Navbar className="bg-dark border-bottom border-secondary d-none d-lg-flex justify-content-center">
          <Navbar.Brand  className="text-light">
            Sociopedika
          </Navbar.Brand>
        </Navbar>

       <Navbar expand="lg" className="bg-dark border-bottom border-secondary d-lg-none">
          <Container fluid className="justify-content-start">
            <Button variant="outline-secondary" onClick={handleShow} className="me-2">
              <FaBars className="text-light" />
            </Button>
            <Navbar.Brand className="text-light align-self-center">
              <FaGlobe size={30} />
            </Navbar.Brand>
          </Container>
        </Navbar>
        
        <Offcanvas show={show} onHide={handleClose} responsive="lg" className="bg-dark text-light d-lg-none">
          <Offcanvas.Header closeButton closeVariant="white">
            <Offcanvas.Title>
              <FaGlobe className="me-2" /> Sociologia
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            <ProfileSection username={adminData.username} email={adminData.email} />
            <Nav className="flex-column w-100">
              <NavLinks handleClose={handleClose} />
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>

        <div className="p-4 flex-grow-1">
        <UserManagement />
          <TheoryManagement />
          
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;