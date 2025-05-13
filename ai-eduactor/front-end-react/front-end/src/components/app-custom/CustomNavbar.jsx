import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './CustomNavbar.css';
import { logout } from "../../services/api";

const CustomNavbar = () => {
    const navigate = useNavigate();
    const [name, setName] = useState(localStorage.getItem("name"));

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        setName(storedName);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setName(null);
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/" style={{ cursor: 'pointer' }}>
                    AI Educator
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Link to="/" className="nav-link">
                        Home
                    </Link>
                    <Link to="/semester-planning" className="nav-link">
                        Semesters
                    </Link>
                    <Link to="/flashcards/game/1" className="nav-link">
                        Flash Cards
                    </Link>
                    <Link to="/subject-recommendation" className="nav-link">
                        Subject Recommendation
                    </Link>
                    <Link to="/course-reviews" className="nav-link">
                        Reviews
                    </Link>
                    <Link to="/chatbot" className="nav-link">
                        ChatBot
                    </Link>
                </Nav>

                <Nav>
                    {name ? (
                        <>
                            <span className="nav-hello-msg">Hello, {name}!</span>
                            <button className="nav-auth-button nav-logout-btn" onClick={handleLogout}>
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-auth-button nav-login-btn">
                                Log In
                            </Link>
                            <Link to="/register" className="nav-auth-button nav-register-btn">
                                Register
                            </Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
