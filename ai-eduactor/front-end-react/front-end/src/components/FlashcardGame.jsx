import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomNavbar from './CustomNavbar';
import './FlashcardsPage.css';
import axios from 'axios';

const FlashcardGame = ({ demo = false }) => {
    const { courseId } = useParams();
    const [flashcards, setFlashcards] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);

    const demoFlashcards = [
        {
            question: "What is React?",
            answer: "A JavaScript library for building user interfaces"
        },
        {
            question: "What is JSX?",
            answer: "A syntax extension for JavaScript that allows you to write HTML-like code in JavaScript"
        },
        {
            question: "What is a React Component?",
            answer: "A reusable piece of UI that can contain its own logic and styling"
        },
        {
            question: "What is the Virtual DOM?",
            answer: "A lightweight copy of the actual DOM that React uses to optimize rendering performance"
        }
    ];

    useEffect(() => {
        if (demo) {
            setFlashcards(demoFlashcards);
            setLoading(false);
        } else {
            const fetchFlashcards = async () => {
                try {
                    const response = await axios.get(`http://localhost:8080/api/flashcards/${courseId}`);
                    setFlashcards(response.data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching flashcards:', error);
                    setLoading(false);
                }
            };
            fetchFlashcards();
        }
    }, [courseId, demo]);

    const handleNext = () => {
        if (currentCard < flashcards.length - 1) {
            setCurrentCard(curr => curr + 1);
            setShowAnswer(false);
        }
    };

    const handlePrevious = () => {
        if (currentCard > 0) {
            setCurrentCard(curr => curr - 1);
            setShowAnswer(false);
        }
    };

    if (loading) {
        return <div>Loading flashcards...</div>;
    }

    return (
        <>
            <CustomNavbar />
            <div className="flashcards-container">
                <h1 className="flashcards-title">{demo ? 'Demo Flashcard Game' : 'Flashcard Game'}</h1>
                <div className="flashcard-game">
                    <div className="progress-info">
                        Card {currentCard + 1} of {flashcards.length}
                    </div>
                    <div
                        className="flashcard"
                        onClick={() => setShowAnswer(!showAnswer)}
                    >
                        <div className="flashcard-content">
                            {showAnswer ? flashcards[currentCard].answer : flashcards[currentCard].question}
                        </div>
                        <div className="flashcard-hint">
                            Click to {showAnswer ? 'see question' : 'see answer'}
                        </div>
                    </div>
                    <div className="game-controls">
                        <button
                            className="flashcards-button"
                            onClick={handlePrevious}
                            disabled={currentCard === 0}
                        >
                            Previous
                        </button>
                        <button
                            className="flashcards-button"
                            onClick={handleNext}
                            disabled={currentCard === flashcards.length - 1}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlashcardGame;