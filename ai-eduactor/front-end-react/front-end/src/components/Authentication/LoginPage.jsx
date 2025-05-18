import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { login } from "../../services/api";

const aiLoginImage = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      try {
        await login(email, password);
        const role = localStorage.getItem("role");
        console.log(role);
        if (role === "ADMIN" || role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } catch (err) {
        setError(err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="p-0 m-0" style={{ overflow: "hidden" }}>
      <Row className="g-0" style={{ height: "100vh" }}>
        <Col
          md={6}
          className="d-none d-md-flex align-items-center justify-content-center login-auth-image-container"
        >
          <img
            src={aiLoginImage}
            alt="AI login"
            className="img-fluid w-100 h-100 object-fit-cover"
            style={{ objectFit: "cover" }}
          />
          <div className="login-auth-overlay">
            <h1>Welcome Back!</h1>
            <p>Continue your learning journey with AI Educator</p>
          </div>
        </Col>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center login-auth-form-container"
        >
          <Card className="p-4 shadow-lg login-card">
            <Card.Body>
              <h2 className="text-center mb-4 login-auth-title">Sign In</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label className="login-form-label">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="login-form-control"
                  />
                </Form.Group>
                <Form.Group controlId="formPassword" className="mb-4">
                  <Form.Label className="login-form-label">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="login-form-control"
                  />
                </Form.Group>
                <div className="d-grid gap-2 login-button-align">
                  <Button
                    variant="primary"
                    type="submit"
                    className="login-auth-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </div>
                <div className="text-center mt-3 login-auth-link-text">
                  New to AI Educator?{" "}
                  <Link to="/register" className="login-auth-link">
                    Create an account
                  </Link>
                </div>
                {error && <div className="text-danger text-center mt-3">{error}</div>}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

