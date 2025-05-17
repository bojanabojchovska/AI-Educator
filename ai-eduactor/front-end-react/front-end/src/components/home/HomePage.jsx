import React, {useEffect, useState} from "react";
import "./HomePage.css";
import CustomNavbar from "../app-custom/CustomNavbar";
import { useNavigate } from "react-router-dom";
import gradCap from "../../assets/grad-cap.png";
import books from "../../assets/books.png";
// import semesterImage from "../../assets/semester-planning.png";  // Placeholder image
// import flashcardImage from "../../assets/flashcards.png";  // Placeholder image
// import reviewsImage from "../../assets/reviews.png";  // Placeholder image

const HomePage = () => {
  const navigate = useNavigate();
  const name = localStorage.getItem("name");

  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role"); // Make sure the key matches your storage
    setUserRole(role);
  }, []);

  const handleNavigate = (path) => {
    const isLoggedIn = localStorage.getItem("email");

    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
      <>
        <CustomNavbar />
        <div className="homepage-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <h1>
                AI Educator
                <img
                    src={gradCap}
                    alt="Graduation Cap"
                    className="grad-cap-img"
                />
              </h1>
              <p>
                Your AI-powered academic consultant—guiding you in subject
                selection, exam prep, and smarter studying.
              </p>
              {userRole === "User" && (
                  <button
                      onClick={() => handleNavigate("/subject-recommendation")}
                      className="btn-primary"
                  >
                    Get Started
                  </button>
              )}

              {userRole === "Admin" && (
                  <button
                      onClick={() => handleNavigate("/admin")}
                      className="btn-primary"
                  >
                    Go to Admin Panel
                  </button>
              )}
            </div>
          </section>

          {/* Subject Recommendation Section */}
          <section className="feature-section">
            <h2>Subject Recommendation</h2>
            <div className="feature-content">
              <img src={"https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"}
                   alt="AI Subject Recommendation" className="feature-image"/>
              <div className="feature-text">
                <p>
                  Struggling to choose the right subjects for your academic path?
                  Our AI can help you find the perfect subjects to apply for based on your preferences, strengths, and
                  career goals.
                  Just provide some basic details, and AI Educator will suggest the best subject options for you.
                </p>
                <button
                    onClick={() => handleNavigate("/subject-recommendation")}
                    className="btn-secondary"
                >
                  Explore Subject Recommendations
                </button>
              </div>
            </div>
          </section>

          {/* Semester Planning Section */}
          <section className="feature-section">
            <h2>Semester Planning</h2>
            <div className="feature-content">
              <img src={"https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"}
                   alt="Semester Planning" className="feature-image"/>
              <div className="feature-text">
                <p>
                  Structure your academic term with ease. Our Semester Planning tool allows you to create semesters, add
                  subjects, and organize learning materials. Upload documents directly within subjects and automatically
                  generate AI-powered flashcards from your content—making your study sessions more focused and
                  productive.
                </p>
                <button
                    onClick={() => handleNavigate("/semester-planning")}
                    className="btn-secondary"
                >
                  Start Planning Your Semester
                </button>
              </div>
            </div>
          </section>

          {/* Flashcards Generator Section */}
          <section className="feature-section">
            <h2>Flashcards AI Generator</h2>
            <div className="feature-content">
              <img src={"https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"}
                   alt="Flashcards Generator" className="feature-image"/>
              <div className="feature-text">
                <p>
                  Make studying more efficient with AI-generated flashcards!
                  Simply upload your notes or learning materials, and our AI will create smart, targeted flashcards to
                  help you revise quickly and effectively.
                  Perfect for exam preparation and active recall.
                </p>
                <button
                    onClick={() => handleNavigate("/flashcards")}
                    className="btn-secondary"
                >
                  Generate Flashcards Now
                </button>
              </div>
            </div>
          </section>

          <section className="feature-section">
            <h2>AI Chatbot Assistant</h2>
            <div className="feature-content">
              <img src={"https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"}
                   alt="AI Chatbot" className="feature-image"/>
              <div className="feature-text">
                <p>
                  Have questions about your study material? Our intelligent chatbot is here to help! After uploading
                  documents to your subjects, you can chat with our AI assistant to get answers, summaries,
                  clarifications, or explanations—instantly and contextually.
                  It's like having a tutor available 24/7 for every piece of content you upload.
                </p>

              </div>
            </div>
          </section>

          {/* Course Reviews Section */}
          <section className="feature-section">
            <h2>Course Reviews</h2>
            <div className="feature-content">
              <img src={"https://letsenhance.io/static/73136da51c245e80edc6ccfe44888a99/1015f/MainBefore.jpg"}
                   alt="Course Reviews" className="feature-image"/>
              <div className="feature-text">
                <p>
                  Unsure about which courses or subjects to choose?
                  Our Course Reviews feature lets you view ratings and comments from other students, helping you make
                  informed decisions before you commit to any subject or course.
                </p>
                <button
                    onClick={() => handleNavigate("/course-reviews")}
                    className="btn-secondary"
                >
                  Browse Course Reviews
                </button>
              </div>
            </div>
          </section>

          <footer>
            <p>&copy; 2025 AI Educator</p>
          </footer>
        </div>
      </>
  );
};

export default HomePage;
