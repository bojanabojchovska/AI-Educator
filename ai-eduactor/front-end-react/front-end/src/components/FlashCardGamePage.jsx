import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getFlashCardsByCourseAndUser, deleteFlashCard } from "../services/api";
import CustomNavbar from "./app-custom/CustomNavbar";
import { Spinner } from "react-bootstrap";
import { FaRedo, FaArrowLeft } from "react-icons/fa";
import "./FlashCardGamePage.css";

const FlashCardGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showEndScreen, setShowEndScreen] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const fetchedCards = await getFlashCardsByCourseAndUser(courseId);
        setCards(fetchedCards);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flashcards:", error);
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [courseId]);

  const flipCard = (id) => {
    setCards(
        cards.map((card) =>
            card.id === id ? { ...card, flipped: !card.flipped } : card
        )
    );
  };

  const nextCard = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowEndScreen(true);
    }
  };

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setShowEndScreen(false);
    setCards(cards.map(card => ({ ...card, flipped: false })));
  };

  const handleBack = () => {
    const courseTitle = cards[0]?.courseTitle;
    navigate(`/course/${courseTitle}`);
  };

  const deleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) {
      return;
    }

    try {
      await deleteFlashCard(id);
      setCards(cards.filter((card) => card.id !== id));
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      alert("Failed to delete flashcard.");
    }
  };

  if (loading) {
    return (
        <div className="loading-spinner-container">
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <p>Loading flashcards...</p>
        </div>
    );
  }

  return (
      <>
        <CustomNavbar />

        {!gameStarted ? (
            <div className="start-game-container">
              <div className="start-game-text">
                <h1>Welcome to Flash Cards Game!</h1>
                <button className="start-btn" onClick={() => setGameStarted(true)}>
                  Start Game
                </button>
              </div>
            </div>
        ) : (
            <div className="flashcard-game-container fade-in">
              <header className="hero-header">
                <div className="hero-title">
                  <h1>Flash Cards Game</h1>
                  <p>
                    Challenge your memory and boost your knowledge
                    <br />
                    with every card you flip.
                  </p>
                </div>
              </header>

              {!loading ? (
                  cards.length > 0 ? (
                      <div className="flashcard-deck">
                        <div className="flashcard-container active">
                          <div
                              className={`flashcard ${cards[currentIndex]?.flipped ? "flipped" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                flipCard(cards[currentIndex].id);
                              }}
                          >
                            <div className="flashcard-front">
                              <div className="flashcard-header">
                                <div className="flashcard-header-align">
                                  <h3>{cards[currentIndex].courseTitle}</h3>
                                  <button
                                      className="delete-btn"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteCard(cards[currentIndex].id);
                                      }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                              <div className="flashcard-content">
                                <p>{cards[currentIndex].question}</p>
                                <div className="hint">Click to flip</div>
                              </div>
                            </div>

                            <div className="flashcard-back">
                              <div className="flashcard-header">
                                <h3>{cards[currentIndex].courseTitle}</h3>
                              </div>
                              <div className="flashcard-content">
                                <p>{cards[currentIndex].answer}</p>
                                <div className="hint">Click to flip back</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                  ) : (
                      <div className="flashcard-content">
                        You do not have flashcards for this course!
                      </div>
                  )
              ) : (
                  <div className="flashcard-content">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
              )}

              {cards.length > 0 && !showEndScreen && (
                  <div className="flashcard-controls">
                    <button className="control-btn prev-btn" onClick={prevCard}>
                      Previous Card
                    </button>
                    <button className="control-btn next-btn" onClick={nextCard}>
                      Next Card
                    </button>
                  </div>
              )}

              {showEndScreen && (
                  <div className="end-screen-container">
                    <div className="end-screen-content">
                      <h2>You've completed all flashcards!</h2>
                      <p>Would you like to review them again or go back?</p>
                      <div className="end-screen-buttons">
                        <button className="end-screen-button restart" onClick={handleRestart}>
                          <FaRedo /> Start Over
                        </button>
                        <button className="end-screen-button back" onClick={handleBack}>
                          <FaArrowLeft /> Back to Course
                        </button>
                      </div>
                    </div>
                  </div>
              )}
            </div>
        )}
      </>
  );
};

export default FlashCardGamePage;