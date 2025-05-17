import React from 'react';
import { FaRedo, FaArrowLeft } from 'react-icons/fa';
import './FlashcardsEndScreen.css';

const FlashcardsEndScreen = ({ onRestart, onBack }) => {
    return (
        <div className="end-screen-container">
            <div className="end-screen-content">
                <h2>You've completed all flashcards!</h2>
                <p>Would you like to review them again or go back?</p>
                <div className="end-screen-buttons">
                    <button className="end-screen-button restart" onClick={onRestart}>
                        <FaRedo /> Start Over
                    </button>
                    <button className="end-screen-button back" onClick={onBack}>
                        <FaArrowLeft /> Back to Course
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FlashcardsEndScreen;