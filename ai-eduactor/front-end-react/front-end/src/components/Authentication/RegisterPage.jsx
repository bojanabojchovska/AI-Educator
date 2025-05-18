import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import { registerUser } from "../../services/api";
import Notification from "../app-custom/Notification";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const aiRegisterImage =
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setNotification({ message: "Passwords do not match!", type: "error" });
      return;
    }

    try {
      await registerUser(name, email, password);
      setNotification({
        message: "Registration successful! Redirecting to Login Page...",
        type: "success",
      });
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setNotification({
        message: err,
        type: "error",
      });
    }
  };

  return (
      <Container fluid className="p-0 m-0" style={{ overflow: "hidden" }}>
        <Row className="g-0" style={{ height: "100vh" }}>
          <Col
              md={6}
              className="d-none d-md-flex align-items-center justify-content-center register-auth-image-container"
          >
            <img
                src={aiRegisterImage}
                alt="AI registration"
                className="img-fluid w-100 h-100 object-fit-cover"
                style={{ objectFit: "cover" }}
            />
            <div className="register-auth-overlay">
              <h1>Join AI Educator</h1>
              <p>Sign up and start your journey with smart learning tools powered by AI.</p>
            </div>
          </Col>
          <Col
              md={6}
              className="d-flex align-items-center justify-content-center register-auth-form-container"
          >
            <Card className="p-4 shadow-lg register-card">
              <Card.Body>
                <h2 className="text-center mb-4 register-auth-title">Create Account</h2>
                <Form onSubmit={handleSubmit}>
                  <Form.Group controlId="formName" className="mb-3">
                    <Form.Label className="register-form-label">Full Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="register-form-control"
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label className="register-form-label">Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="register-form-control"
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label className="register-form-label">Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="register-form-control"
                    />
                  </Form.Group>
                  <Form.Group controlId="formRepeatPassword" className="mb-4">
                    <Form.Label className="register-form-label">Repeat Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Repeat password"
                        value={repeatPassword}
                        onChange={(e) => setRepeatPassword(e.target.value)}
                        required
                        className="register-form-control"
                    />
                  </Form.Group>
                  <div className="d-grid gap-2 register-button-align">
                    <Button
                        variant="primary"
                        type="submit"
                        className="register-auth-submit-btn"
                    >
                      Register
                    </Button>
                  </div>
                  <div className="text-center mt-3 register-auth-link-text">
                    Already have an account?{" "}
                    <Link to="/login" className="register-auth-link">
                      Sign in here
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}
          </Col>
        </Row>
      </Container>
  );
};

export default RegisterPage;