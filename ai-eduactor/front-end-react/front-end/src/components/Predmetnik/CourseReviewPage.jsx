import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {FaArrowDown, FaArrowLeft, FaArrowUp, FaCommentAlt, FaStar, FaTrash} from 'react-icons/fa';
import CustomNavbar from '../app-custom/CustomNavbar';
import StarRatings from 'react-star-ratings';
import {
    deleteComment,
    getCourses,
    getSubjectReviews,
    submitSubjectComment,
    submitSubjectReview
} from '../../services/api';
import './CourseReviewPage.css';

const CourseReviewPage = () => {
    const studentEmail = localStorage.getItem("email");

    const {courseId} = useParams();
    const navigate = useNavigate();
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');
    const [reviews, setReviews] = useState({comments: [], averageRating: 0});
    const [newReview, setNewReview] = useState({rating: 0, feedback: ''});
    const [commentFeedback, setCommentFeedback] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [sortOrder, setSortOrder] = useState('latest'); // 'latest' or 'oldest'

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

        if (!newReview.rating || newReview.rating < 1) {
            setError('Please provide a rating (1-5 stars)');
            return;
        }

        setIsSubmittingReview(true);
        setError(null);
        setSuccessMessage('');

        try {
            await submitSubjectReview(courseId, {
                rating: newReview.rating,
                feedback: newReview.feedback
            });

            setNewReview({rating: 0, feedback: ''});
            setSuccessMessage('Your review was submitted successfully!');

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
        setNewReview(prev => ({...prev, rating: Number(rating)}));
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
    };

    const getSortedComments = () => {
        if (!reviews.comments) return [];
        return [...reviews.comments].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return sortOrder === 'latest'
                ? dateB - dateA
                : dateA - dateB;
        });
    };

    return (
        <>
            <CustomNavbar/>
            <div className="course-review-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/course-reviews')}
                >
                    <FaArrowLeft/> Back to Courses
                </button>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="review-section">
                    <h2>{courseName}</h2>
                    <p>{courseDescription}</p>
                    <div className="average-rating">
                        <p>Average Rating:
                            <span className="rating-value">
                                {reviews.averageRating ? Number(reviews.averageRating).toFixed(1) : 'No ratings yet'}
                            </span>
                            {reviews.averageRating > 0 && (
                                <StarRatings
                                    rating={Number(reviews.averageRating) || 0}
                                    starRatedColor="#ffc107"
                                    numberOfStars={5}
                                    name="average-rating"
                                    starDimension="25px"
                                    starSpacing="2px"
                                    starEmptyColor="#ddd"
                                    isSelectable={false}
                                    isHalf={true}
                                />
                            )}
                        </p>
                    </div>

                    <div className="forms-container forms-symmetrical">
                        <div className="form-flex-item">
                            <form onSubmit={handleSubmitReview} className="new-review-form review-section">
                                <h3><FaStar className="form-icon"/> Add Your Review</h3>
                                <div className="rating-selection">
                                    <label>Your Rating:</label>
                                    <StarRatings
                                        rating={newReview.rating}
                                        starRatedColor="#ffc107"
                                        changeRating={handleRatingClick}
                                        numberOfStars={5}
                                        name="new-rating"
                                        starDimension="25px"
                                        starSpacing="2px"
                                        starEmptyColor="#ddd"
                                        isHalf={true}
                                        isSelectable={true}
                                        starHoverColor="#ffc107"
                                    />
                                </div>
                                <div className="feedback-container">
                                    <label htmlFor="feedback">Your Review (optional):</label>
                                    <textarea
                                        id="feedback"
                                        placeholder="Write your review here..."
                                        value={newReview.feedback}
                                        onChange={(e) => setNewReview({...newReview, feedback: e.target.value})}
                                        rows="6"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submit-btn-review"
                                    disabled={isSubmittingReview}
                                >
                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </form>
                        </div>
                        <div className="form-flex-item">
                            <form onSubmit={handleSubmitComment} className="new-review-form comment-section">
                                <h3><FaCommentAlt className="form-icon"/> Add a Comment</h3>
                                <div className="feedback-container">
                                    <label htmlFor="commentFeedback">Your Comment:</label>
                                    <textarea
                                        id="commentFeedback"
                                        placeholder="Ask a question or share your thoughts..."
                                        value={commentFeedback}
                                        onChange={(e) => setCommentFeedback(e.target.value)}
                                        rows="6"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submit-btn-comment"
                                    disabled={isSubmittingComment}
                                >
                                    {isSubmittingComment ? 'Submitting...' : 'Submit Comment'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="reviews-list">
                        <div className="reviews-list-header-row">
                            <h3>All Reviews</h3>
                            <div className="review-sort-toggle">
                                <button
                                    className={`sort-btn ${sortOrder === 'latest' ? 'active' : ''}`}
                                    onClick={() => setSortOrder('latest')}
                                    aria-label="Sort by latest"
                                >
                                    <FaArrowDown/> Latest
                                </button>
                                <button
                                    className={`sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                                    onClick={() => setSortOrder('oldest')}
                                    aria-label="Sort by oldest"
                                >
                                    <FaArrowUp/> Oldest
                                </button>
                            </div>
                        </div>
                        <div className="review-table-header">
                            <div className="review-table-user">User</div>
                            <div className="review-table-date">Date</div>
                            <div className="review-table-body">Review / Comment</div>
                            <div className="review-table-actions"></div>
                        </div>
                        {getSortedComments().length > 0 ? (
                            getSortedComments().map((comment, index) => (
                                <div key={index}
                                     className={`review-card-table ${comment.rating ? 'rating' : 'comment'}`}>
                                    <div className="review-table-user">
                                        <span className="student-name"><strong>{comment.student.name}</strong></span>
                                        <span className="user-email"><small>{comment.student.email}</small></span>
                                    </div>
                                    <div className="review-table-date">
                                        {new Date(comment.date).toLocaleDateString()}
                                    </div>
                                    <div className="review-table-body">
                                        {comment.commentBody}
                                    </div>
                                    <div className="review-table-actions">
                                        {studentEmail === comment.student.email && (
                                            <button className="review-table-delete-btn"
                                                    onClick={() => handleDeleteButton(comment.id)}>
                                                <FaTrash/> Delete
                                            </button>
                                        )}
                                    </div>
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

