import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SubjectReviews.css';
import CustomNavbar from './CustomNavbar';
import { FaStar } from 'react-icons/fa';

const SubjectReviews = () => {
    const [subjects, setSubjects] = useState([]);
    const [reviews, setReviews] = useState({});
    const [hoveredRating, setHoveredRating] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEnrolledSubjects();
    }, []);

    const fetchEnrolledSubjects = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/subjects/enrolled', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setSubjects(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch subjects');
            console.error('Error fetching subjects:', err);
        }
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
        const review = reviews[subjectId];
        if (!review || !review.rating) {
            alert('Please provide at least a rating');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/subjects/${subjectId}/reviews`, {
                rating: review.rating,
                feedback: review.feedback || '',
            }, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            // Clear the review form after successful submission
            setReviews(prev => ({
                ...prev,
                [subjectId]: { rating: 0, feedback: '' }
            }));
            
            alert('Review submitted successfully!');
        } catch (err) {
            alert('Failed to submit review. Please try again.');
            console.error('Error submitting review:', err);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="subject-reviews-container">
                <h1>Subject Reviews</h1>
                {error && <div className="error-message">{error}</div>}
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
