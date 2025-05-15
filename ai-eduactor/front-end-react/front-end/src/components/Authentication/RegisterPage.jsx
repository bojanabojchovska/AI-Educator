import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import "./RegisterPage.css";
import axios from "axios";
import {AUTH_BASE_URL, registerUser} from "../../services/api";
import Notification from "../app-custom/Notification"; // Import the Notification component
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import aiImage from "../../assets/books.png";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [notification, setNotification] = useState(null); // State for notification
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
    }catch(err){
      setNotification({
        message: err,
        type: "error"
      })
      console.log(err);
    }
  };

  return (
    <Container fluid className="p-0 m-0" style={{ overflow: "hidden" }}>
      <Row className="g-0" style={{ height: "100vh" }}>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <img
            src={aiImage}
            alt="AI helping students"
            className="img-fluid w-100 h-100 object-fit-cover"
          />
        </Col>
        <Col
          md={6}
          className="d-flex align-items-center justify-content-center"
        >
          <Card className="p-4 shadow-sm register-card w-75">
            <Card.Body>
              <h2 className="text-center mb-4">Register</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formName" className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formEmail" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group controlId="formRepeatPassword" className="mb-4">
                  <Form.Label>Repeat Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat password"
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid gap-2 register-button-align">
                  <Button
                    variant="primary"
                    type="submit"
                    style={{
                      border: "none",
                      background: "linear-gradient(135deg, #800000, #3c0101)",
                    }}
                  >
                    Register
                  </Button>
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

    // <div className="register-container">
    //     <div className="register-content">
    //         <div className="register-box">
    //             <h1>Welcome Students! Register Here</h1>
    //             <form onSubmit={handleSubmit}>
    //                 <input
    //                     type="text"
    //                     placeholder="Name"
    //                     value={name}
    //                     onChange={(e) => setName(e.target.value)}
    //                     required
    //                 />
    //                 <input
    //                     type="email"
    //                     placeholder="Email"
    //                     value={email}
    //                     onChange={(e) => setEmail(e.target.value)}
    //                     required
    //                 />
    //                 <input
    //                     type="password"
    //                     placeholder="Password"
    //                     value={password}
    //                     onChange={(e) => setPassword(e.target.value)}
    //                     required
    //                 />
    //                 <input
    //                     type="password"
    //                     placeholder="Repeat Password"
    //                     value={repeatPassword}
    //                     onChange={(e) => setRepeatPassword(e.target.value)}
    //                     required
    //                 />
    //                 <button type="submit">Register</button>
    //             </form>
    //             <div className="login-link">
    //                 Already have an account? <Link to="/login">Login here</Link>
    //             </div>
    //         </div>
    //         <div className="logo-container">
    //             <h2>AI Educator</h2>
    //             <GraduationCap size={400} strokeWidth={1.5} />
    //         </div>
    //     </div>

    //     {/* Show notification if there's a message */}
    //     {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
    // </div>
  );
};

export default RegisterPage;
