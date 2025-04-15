import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import CustomNavbar from './CustomNavbar';
import { getSubjectReviews, submitSubjectReview } from '../repository/api';
import './CourseReviewPage.css'; // Make sure to create this CSS file

const CourseReviewPage = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState({ comments: [], averageRating: 0 });
    const [newReview, setNewReview] = useState({ rating: 0, feedback: '' });
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [courseName, setCourseName] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            setError(null);
            const data = await getSubjectReviews(courseId);
            setReviews(data);
        } catch (err) {
            console.error('Error fetching reviews:', err);
            setError('Failed to fetch reviews. Please try again later.');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        // Validation
        if (!newReview.rating || newReview.rating < 1) {
            setError('Please provide a rating (1-5 stars)');
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setSuccessMessage('');

        try {
            // Make sure courseId is treated as a number
            await submitSubjectReview(courseId, {
                rating: newReview.rating,
                feedback: newReview.feedback
            });

            // Reset form and show success message
            setNewReview({ rating: 0, feedback: '' });
            setSuccessMessage('Your review was submitted successfully!');

            // Refresh reviews to show the new one
            fetchReviews();
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(typeof err === 'string' ? err : 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRatingClick = (rating) => {
        setNewReview(prev => ({...prev, rating}));
    };

    return (
        <>
            <CustomNavbar />
            <div className="course-review-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/courses')}
                >
                    &larr; Back to Courses
                </button>

                <div className="review-section">
                    <h2>{courseName || `Course Reviews (ID: ${courseId})`}</h2>
                    <div className="average-rating">
                        <p>Average Rating:
                            <span className="rating-value">
                                {reviews.averageRating ? reviews.averageRating.toFixed(1) : 'No ratings yet'}
                            </span>
                            {reviews.averageRating > 0 && (
                                <span className="stars-display">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <FaStar
                                            key={star}
                                            className={reviews.averageRating >= star ? 'star filled' : 'star empty'}
                                        />
                                    ))}
                                </span>
                            )}
                        </p>
                    </div>

                    <form onSubmit={handleSubmitReview} className="new-review-form">
                        <h3>Add Your Review</h3>

                        {error && <div className="error-message">{error}</div>}
                        {successMessage && <div className="success-message">{successMessage}</div>}

                        <div className="rating-selection">
                            <label>Your Rating:</label>
                            <div className="stars-container">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <FaStar
                                        key={star}
                                        className={`star ${newReview.rating >= star ? 'active' : ''}`}
                                        onClick={() => handleRatingClick(star)}
                                    />
                                ))}
                            </div>
                        </div>

                        <div className="feedback-container">
                            <label htmlFor="feedback">Your Comments (optional):</label>
                            <textarea
                                id="feedback"
                                placeholder="Write your feedback here..."
                                value={newReview.feedback}
                                onChange={(e) => setNewReview({...newReview, feedback: e.target.value})}
                                rows="4"
                            />
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>

                    <div className="reviews-list">
                        <h3>All Reviews</h3>
                        {reviews.comments && reviews.comments.length > 0 ? (
                            reviews.comments.map((comment, index) => (
                                <div key={index} className="review-item">
                                    <p className="review-content">{comment.content}</p>
                                    {comment.createdAt && (
                                        <p className="review-date">
                                            {new Date(comment.createdAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="no-reviews">No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseReviewPage;