import React, { useState, useEffect } from 'react';
import './SubjectReviews.css';
import CustomNavbar from './CustomNavbar';
import { FaStar } from 'react-icons/fa';

const SubjectReviews = () => {
    const [subjects, setSubjects] = useState([]);
    const [reviews, setReviews] = useState({});
    const [hoveredRating, setHoveredRating] = useState({});
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        //TODO: Add actuual axios call to fetch enrolled subjects
        fetchEnrolledSubjects();
    }, []);

    const fetchEnrolledSubjects = async () => {
        setSubjects([
            { id: 1, name: "Mathematics" },
            { id: 2, name: "Physics" },
            { id: 3, name: "Computer Science" }
        ]);
    };

    const filteredSubjects = subjects.filter(subject =>
        subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRatingClick = (subjectId, rating) => {
        setReviews(prev => ({
            ...prev,
            [subjectId]: { ...prev[subjectId], rating }
        }));
    };

    const handleFeedbackChange = (subjectId, feedback) => {
        setReviews(prev => ({
            ...prev,
            [subjectId]: { ...prev[subjectId], feedback }
        }));
    };

    const submitReview = async (subjectId) => {
        //TODO: Add actual axios call to submit review
        const review = reviews[subjectId];
        console.log('Submitting review:', { subjectId, review });
    };

    return (
        <>
            <CustomNavbar />
            <div className="subject-reviews-container">
                <h1>Subject Reviews</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search subjects..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="subjects-grid">
                    {filteredSubjects.map(subject => (
                        <div key={subject.id} className="subject-box">
                            <h3>{subject.name}</h3>
                            <div className="rating-container">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FaStar
                                        key={star}
                                        className={`star ${(reviews[subject.id]?.rating || hoveredRating[subject.id] || 0) >= star ? 'active' : ''}`}
                                        onMouseEnter={() => setHoveredRating({...hoveredRating, [subject.id]: star})}
                                        onMouseLeave={() => setHoveredRating({...hoveredRating, [subject.id]: 0})}
                                        onClick={() => handleRatingClick(subject.id, star)}
                                    />
                                ))}
                            </div>
                            <textarea
                                placeholder="Write your feedback here..."
                                value={reviews[subject.id]?.feedback || ''}
                                onChange={(e) => handleFeedbackChange(subject.id, e.target.value)}
                            />
                            <button
                                className="submit-btn"
                                onClick={() => submitReview(subject.id)}
                            >
                                Submit Review
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default SubjectReviews;