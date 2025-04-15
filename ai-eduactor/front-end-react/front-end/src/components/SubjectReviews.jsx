import React, { useState, useEffect } from 'react';
import './SubjectReviews.css';
import CustomNavbar from './CustomNavbar';
import { FaStar } from 'react-icons/fa';
import { getCourses, submitSubjectReview } from '../repository/api';

const SubjectReviews = () => {
    const [subjects, setSubjects] = useState([]);
    const [reviews, setReviews] = useState({});
    const [hoveredRating, setHoveredRating] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getCourses();
            // Transform the course data to match expected structure
            const formattedCourses = data.map(course => ({
                id: course.courseId || course.id, // handle both possible id field names
                name: course.courseName || course.name || course.title, // handle different possible name fields
            }));
            setSubjects(formattedCourses);
            setError(null);
        } catch (err) {
            setError('Failed to fetch subjects. Please try again later.');
            console.error('Error fetching subjects:', err);
        }
    };

    // Add debug logging
    useEffect(() => {
        console.log('Current subjects:', subjects);
    }, [subjects]);

    const filteredSubjects = subjects.filter(subject =>
        subject?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || []
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
            await submitSubjectReview(subjectId, {
                rating: review.rating,
                feedback: review.feedback || ''
            });
            
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
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map(subject => (
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
                        ))
                    ) : (
                        <div className="error-message">No subjects found.</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default SubjectReviews;

