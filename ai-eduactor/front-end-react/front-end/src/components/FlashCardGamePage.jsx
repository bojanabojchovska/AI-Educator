import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";  
import { getFlashCardsByCourseId, deleteFlashCard } from "../repository/api";
import CustomNavbar from "./CustomNavbar";
import "./FlashCardGamePage.css"; 

const FlashCardGamePage = () => {
  const { courseId } = useParams();  
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false); 

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const fetchedCards = await getFlashCardsByCourseId(courseId);
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
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: !card.flipped } : card
    ));
  };

  const nextCard = () => {
    setCards([...cards.slice(1), cards[0]]);
  };

  const prevCard = () => {
    setCards([cards[cards.length - 1], ...cards.slice(0, cards.length - 1)]);
  };

  const deleteCard = async (id) => {
    if (!window.confirm("Are you sure you want to delete this flashcard?")) {
      return;
    }
  
    try {
      await deleteFlashCard(id); 
      setCards(cards.filter(card => card.id !== id)); 
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
          <h1>Welcome to Flash Cards Game!</h1>
          <button 
            className="start-btn" 
            onClick={() => setGameStarted(true)}
          >
            Start Game
          </button>
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

          <div className="flashcard-deck">
            {cards.map((card, index) => (
              <div 
                key={card.id}
                className={`flashcard-container ${index === 0 ? 'active' : ''}`}
              >
                <div 
                  className={`flashcard ${card.flipped ? 'flipped' : ''}`}
                  onClick={() => flipCard(card.id)}
                >
                  <div className="flashcard-front">
                    <div className="flashcard-header">
                      <h3>Subject</h3>
                    </div>
                    <div className="flashcard-content">
                      <p>{card.question}</p>
                      <div className="hint">Click to flip</div>
                    </div>
                    <button 
                      className="delete-btn"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        deleteCard(card.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flashcard-back">
                    <div className="flashcard-header">
                      <h3>Subject</h3>
                    </div>
                    <div className="flashcard-content">
                      <p>{card.answer}</p>
                      <div className="hint">Click to flip back</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flashcard-controls">
            <button className="control-btn prev-btn" onClick={prevCard}>
              Previous Card
            </button>
            <button className="control-btn next-btn" onClick={nextCard}>
              Next Card
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashCardGamePage;
