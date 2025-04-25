import React, { useState } from "react";
import CustomNavbar from "./CustomNavbar";
import "./FlashCardGamePage.css"; // We'll create this CSS file

const FlashCardGamePage = () => {
  // Sample flash cards data
  const [cards, setCards] = useState([
    {
      id: 1,
      front: {
        title: "React",
        content: "What is React?"
      },
      back: {
        title: "React",
        content: "A JavaScript library for building user interfaces"
      },
      flipped: false
    },
    {
      id: 2,
      front: {
        title: "Components",
        content: "What are React components?"
      },
      back: {
        title: "Components",
        content: "Independent and reusable bits of code that return React elements"
      },
      flipped: false
    },
    {
      id: 3,
      front: {
        title: "JSX",
        content: "What is JSX?"
      },
      back: {
        title: "JSX",
        content: "Syntax extension to JavaScript that allows writing HTML-like code in JavaScript"
      },
      flipped: false
    }
  ]);

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

  // Delete card function
  const deleteCard = (id) => {
    setCards(cards.filter(card => card.id !== id));
  };

  return (
    <>
      <CustomNavbar />
      <div className="flashcard-game-container">
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
                    <h3>{card.front.title}</h3>
                  </div>
                  <div className="flashcard-content">
                    <p>{card.front.content}</p>
                    <div className="hint">Click to flip</div>
                  </div>
                  {/* Delete button on the front side */}
                  <button 
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card flip on button click
                      deleteCard(card.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
                <div className="flashcard-back">
                  <div className="flashcard-header">
                    <h3>{card.back.title}</h3>
                  </div>
                  <div className="flashcard-content">
                    <p>{card.back.content}</p>
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
    </>
  );
};

export default FlashCardGamePage;
