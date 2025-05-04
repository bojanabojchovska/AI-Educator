import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomNavbar from './CustomNavbar';
import './FlashcardGame.css';
import axios from 'axios';
import {getFlashCardsByCourseId} from "../repository/api";

const FlashcardGame = ({ demo = false }) => {
    const { courseId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);

    const demoFlashcards = [
        {
            question: "What is React?",
            answer: "A JavaScript library for building user interfaces",
            flipped: false
        },
        {
            question: "What is JSX?",
            answer: "A syntax extension for JavaScript that allows you to write HTML-like code in JavaScript",
            flipped: false
        },
        {
            question: "What is a React Component?",
            answer: "A reusable piece of UI that can contain its own logic and styling",
            flipped: false
        },
        {
            question: "What is the Virtual DOM?",
            answer: "A lightweight copy of the actual DOM that React uses to optimize rendering performance",
            flipped: false
        }
    ];

    useEffect(() => {
        if (demo) {
            setFlashcards(demoFlashcards);
            setLoading(false);
        } else {
            const fetchFlashcards = async () => {
                try {
                    const fetchedCards = await getFlashCardsByCourseId(courseId);
                    // Add flipped property to each card
                    const cardsWithFlipped = fetchedCards.map(card => ({
                        ...card,
                        flipped: false
                    }));
                    setFlashcards(cardsWithFlipped);
                    setLoading(false);
                } catch (error) {
                    console.error("Error fetching flashcards:", error);
                    setLoading(false);
                }
            };
            fetchFlashcards();
        }
    }, [courseId, demo]);

    const flipCard = (id) => {
        setFlashcards(cards => cards.map(card =>
            card.id === id ? { ...card, flipped: !card.flipped } : card
        ));
    };

    const handleNext = () => {
        if (currentCard < flashcards.length - 1) {
            setCurrentCard(curr => curr + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCard > 0) {
            setCurrentCard(curr => curr - 1);
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
                    <h1>Welcome to {demo ? 'Demo ' : ''}Flash Cards Game!</h1>
                    <button className="start-btn" onClick={() => setGameStarted(true)}>
                        Start Game
                    </button>
                </div>
            ) : (
                <div className="flashcard-game-container fade-in">
                    <header className="hero-header">
                        <div className="hero-title">
                            <h1>{demo ? 'Demo ' : ''}Flash Cards Game</h1>
                            <p>Challenge your memory and boost your knowledge with every card you flip.</p>
                        </div>
                    </header>

                    <div className="flashcard-deck">
                        {flashcards.map((card, index) => (
                            <div
                                key={card.id}
                                className={`flashcard-container ${index === currentCard ? 'active' : ''}`}
                            >
                                <div
                                    className={`flashcard ${card.flipped ? 'flipped' : ''}`}
                                    onClick={() => flipCard(card.id)}
                                >
                                    <div className="flashcard-front">
                                        <div className="flashcard-header">
                                            <h3>Question</h3>
                                        </div>
                                        <div className="flashcard-content">
                                            <p>{card.question}</p>
                                            <div className="hint">Click to flip</div>
                                        </div>
                                    </div>
                                    <div className="flashcard-back">
                                        <div className="flashcard-header">
                                            <h3>Answer</h3>
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

                    <div className="game-controls">
                        <button
                            className="control-btn"
                            onClick={handlePrevious}
                            disabled={currentCard === 0}
                        >
                            Previous Card
                        </button>
                        <button
                            className="control-btn"
                            onClick={handleNext}
                            disabled={currentCard === flashcards.length - 1}
                        >
                            Next Card
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default FlashcardGame;