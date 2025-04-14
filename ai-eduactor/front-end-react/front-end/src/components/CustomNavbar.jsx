import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './CustomNavbar.css'; // <- Add this line if styles are in Navbar.css

const CustomNavbar = () => {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
                    AI Educator
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Nav.Link onClick={() => handleNavigate('/')}>Home</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/semesters')}>Semesters</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/flash-cards')}>Flash Cards</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/subject-recommendation')}>Subject Recommendation</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/comments')}>Comments</Nav.Link>
                </Nav>

                <Nav>
                    <button className="nav-auth-button nav-login-btn" onClick={() => handleNavigate('/login')}>
                        Log In
                    </button>
                    <button className="nav-auth-button nav-register-btn" onClick={() => handleNavigate('/register')}>
                        Register
                    </button>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
