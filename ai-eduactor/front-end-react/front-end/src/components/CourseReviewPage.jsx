import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import CustomNavbar from './CustomNavbar';
import {
    getSubjectReviews,
    submitSubjectReview,
    getCourses,
    submitSubjectComment,
    deleteComment
} from '../repository/api';
import './CourseReviewPage.css';

const CourseReviewPage = () => {
    const studentEmail = localStorage.getItem("email");

    const { courseId } = useParams();
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [reviews, setReviews] = useState({ comments: [], averageRating: 0 });
    const [newReview, setNewReview] = useState({ rating: 0, feedback: '' });
    const [commentFeedback, setCommentFeedback] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        fetchCourseData();
        fetchReviews();
    }, [courseId]);

    const fetchCourseData = async () => {
        try {
            const courses = await getCourses();
            const course = courses.find(c =>
                String(c.courseId) === String(courseId) ||
                String(c.id) === String(courseId)
            );
            if (course) {
                setCourseName(course.title);
                setCourseDescription(course.description);
            }
        } catch (err) {
            console.error('Error fetching course:', err);
        }
    };

    const fetchReviews = async () => {
        try {
            setError(null);
            const data = await getSubjectReviews(courseId);
            console.log("Fetched reviews:", data);
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

        setIsSubmittingReview(true);
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
            await fetchReviews();
        } catch (err) {
            console.error('Error submitting review:', err);
            setError(typeof err === 'string' ? err : 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!commentFeedback) {
            setError('Please provide a comment');
            return;
        }

        setIsSubmittingComment(true);
        setError(null);
        setSuccessMessage('');

        try {
            await submitSubjectComment(courseId, commentFeedback);

            setCommentFeedback('');
            setSuccessMessage('Your comment was submitted successfully!');

            await fetchReviews();
        } catch (err) {
            console.error('Error submitting comment:', err);
            setError(typeof err === 'string' ? err : 'Failed to submit comment. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleRatingClick = (rating) => {
        setNewReview(prev => ({...prev, rating}));
    };

    const handleDeleteButton = async (commentId) => {
        try {
            setError(null);
            setSuccessMessage('Your comment has been deleted successfully!');

            const data = await deleteComment(courseId, commentId);

            await fetchReviews();
        } catch (err) {
            console.error('Error deleting comment:', err);
            setError('Failed to delete comment. Please try again later.');
        }
    }

    return (
        <>
            <CustomNavbar />
            <div className="course-review-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/course-reviews')}
                >
                    &larr; Back to Courses
                </button>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="review-section">
                    <h2>{courseName}</h2>
                    <p>{courseDescription}</p>
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

                    <div className="forms-container">
                        <form onSubmit={handleSubmitReview} className="new-review-form">
                            <h3>Add Your Review</h3>

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
                                disabled={isSubmittingReview}
                            >
                                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </form>

                        <form onSubmit={handleSubmitComment} className="new-review-form">
                            <h3>Ask a question or express your opinion!</h3>

                            <div className="feedback-container">
                                <textarea
                                    id="commentFeedback"
                                    placeholder="Write your comment here..."
                                    value={commentFeedback}
                                    onChange={(e) => setCommentFeedback(e.target.value)}
                                    rows="9"
                                />
                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={isSubmittingComment}
                            >
                                {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
                            </button>
                        </form>
                    </div>


                    <div className="reviews-list">
                        <h3>All Reviews</h3>
                        {reviews.comments && reviews.comments.length > 0 ? (
                            reviews.comments.map((comment, index) => (
                                <div key={index} className="review-card">
                                    {/* Review Header: User info */}
                                    <div className="review-header">
                                        <div className="review-user">
                                            <div className="user-info">
                                                <p className="student-name"><strong>{comment.student.name}</strong></p>
                                                <p className="user-email"><small>{comment.student.email}</small></p>
                                            </div>
                                        </div>
                                        <div className="review-date">
                                            <p>{new Date(comment.date).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    {/* Review Content */}
                                    <div className="review-body">
                                        <p>{comment.commentBody}</p>
                                    </div>
                                    {studentEmail === comment.student.email ? (
                                        <div className="comment-buttons">
                                            <button onClick={() => handleDeleteButton(comment.id)}>Delete</button>
                                        </div>
                                    ) : null}
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