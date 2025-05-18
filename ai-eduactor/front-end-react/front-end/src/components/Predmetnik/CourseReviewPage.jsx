import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {FaDownload, FaFilePdf} from 'react-icons/fa';
import CustomNavbar from '../app-custom/CustomNavbar';
import StarRatings from 'react-star-ratings';
import {
    deleteComment, fetchCommentAttachments,
    getCourses, getFlashCardsByCourse,
    getSubjectReviews,
    submitSubjectComment,
    submitSubjectReview
} from '../../services/api';
import './CourseReviewPage.css';

const CourseReviewPage = () => {
    const studentEmail = localStorage.getItem("email");
    const navigate = useNavigate();
    const location = useLocation();

    const {courseId} = useParams();
    const [courseName, setCourseName] = useState('');
    const [courseDescription, setCourseDescription] = useState('');

    const [reviews, setReviews] = useState({comments: [], averageRating: 0});
    const [averageRating, setAverageRating] = useState(0);
    const [comments, setComments] = useState([]);

    const [newReview, setNewReview] = useState({rating: 0, feedback: ''});
    const [commentFeedback, setCommentFeedback] = useState('');

    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const [selectedFiles, setSelectedFiles] = useState([]);
    const [attachmentsMap, setAttachmentsMap] = useState({}); // commentId -> [attachments]
    const [expandedComments, setExpandedComments] = useState(new Set());

    const [defaultFlashCards, setDefaultFlashCards] = useState([]);

    const [activeTab, setActiveTab] = useState('reviews');

    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchCourseData();
        fetchReviews();
        fetchCourseFlashCards();
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
            const {reviews, comments, averageRating} = await getSubjectReviews(courseId);

            setReviews(reviews);
            setComments(comments);
            setAverageRating(averageRating);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data. Please try again later.');
        }
    };

    const fetchCourseFlashCards = async () => {
        try{
            const flashcards = await getFlashCardsByCourse(courseId);
            setDefaultFlashCards(flashcards);
        }catch (err) {
            console.error('Error fetching falshCards:', err);
            setError('Failed to fetch falshCards. Please try again later.');
        }
    }

    const handleSubmitReview = async (e) => {
        console.log(">>> Submitting REVIEW with rating + feedback");
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
                feedback: newReview.feedback,
                isReview: "true"
            });

            // Reset form and show success message
            setNewReview({rating: 0, feedback: ''});
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
        console.log(">>> Submitting COMMENT");
        e.preventDefault();

        if (!commentFeedback) {
            setError('Please provide a comment');
            return;
        }

        setIsSubmittingComment(true);
        setError(null);
        setSuccessMessage('');

        try {
            const formData = new FormData();
            formData.append('commentBody', commentFeedback.trim());
            selectedFiles.forEach((file) => {
                formData.append('attachments', file);
            });

            const comment = await submitSubjectComment(courseId, formData);

            setCommentFeedback('');
            setSuccessMessage('Your comment was submitted successfully!');

            setSelectedFiles([]);
            setAttachmentsMap({});
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
    }

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const toggleAttachments = async (commentId) => {
        const newExpanded = new Set(expandedComments);

        if (newExpanded.has(commentId)) {
            newExpanded.delete(commentId);
        } else {
            newExpanded.add(commentId);

            // Fetch only if not already loaded
            if (!attachmentsMap[commentId]) {
                try {
                    const attachments = await fetchCommentAttachments(courseId, commentId); // Using the new function
                    setAttachmentsMap(prev => ({...prev, [commentId]: attachments}));
                } catch (err) {
                    console.error(err.message); // Handle error (if any)
                }
            }
        }

        setExpandedComments(newExpanded);
    };

    return (
        <>
            <CustomNavbar/>
            <div className="course-review-container">
                <button
                    className="back-button"
                    onClick={() => navigate('/course-reviews')}
                >
                    &larr; Back to Courses
                </button>

                {error && <div className="error-message">{error}</div>}
                {successMessage && <div className="success-message">{successMessage}</div>}

                <div className="course-info">
                    <h2>{courseName}</h2>
                    <p>{courseDescription}</p>
                    <div className="average-rating">
                        <p>Average Rating:
                            <span className="rating-value">
    {averageRating ? Number(averageRating).toFixed(1) : 'No ratings yet'}
</span>
                            {averageRating > 0 && (
                                <StarRatings
                                    rating={Number(averageRating) || 0}  // Ensure it's a number
                                    starRatedColor="#ffc107"
                                    numberOfStars={5}
                                    name="average-rating"
                                    starDimension="25px"
                                    starSpacing="2px"
                                    starEmptyColor="#ddd"
                                    isSelectable={false}  // Add this since it's display only
                                    isHalf={true}
                                />
                            )}
                        </p>
                        </div>
                </div>

                {/* Flashcards section */}
                {defaultFlashCards && defaultFlashCards.length > 0 && (
                    <div className="flashcards-info">
                        <p>There is default quiz available for this course!The flashcards every student has generated
                            for this course are used to make a default quiz available for all students! Currently there are {defaultFlashCards.length}
                            unique flashcards available. As more students upload attachments and generate flashcards for this course, there will be more!</p>
                        <button
                            className="view-flashcards-button"
                            onClick={() =>  navigate(`/flashcard-game/${courseId}`, { state: { default: true, from: location.pathname } })}
                        >
                            View Flashcards
                        </button>
                    </div>
                )}

                <div className="tab-buttons">
                    <button
                        className={activeTab === 'reviews' ? 'active' : ''}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Reviews
                    </button>
                    <button
                        className={activeTab === 'comments' ? 'active' : ''}
                        onClick={() => setActiveTab('comments')}
                    >
                        Comments
                    </button>
                </div>

                {activeTab === 'reviews' && (
                    <div className="reviews-section">
                        <form onSubmit={handleSubmitReview} className="new-review-form">
                            <h3>Add Your Review</h3>

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

                        <div className="reviews-list">
                            <h3>All Reviews</h3>
                            {reviews && reviews.length > 0 ? (
                                reviews.map((review, index) => (
                                    <div key={index} className="review-card">
                                        <div className="review-header">
                                            <div className="review-user">
                                                <div className="user-info">
                                                    <p className="student-name"><strong>{review.student.name}</strong>
                                                    </p>
                                                    <p className="user-email"><small>{review.student.email}</small></p>
                                                </div>
                                            </div>
                                            <div className="review-date">
                                                <p>{new Date(review.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="review-body">
                                            <p>{review.commentBody}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No reviews yet. Be the first to review!</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'comments' && (
                    <div className="comments-section">
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

                            <div className="file-upload-container">
                                <label htmlFor="attachmentFiles">Attach files (optional):</label>
                                <input
                                    type="file"
                                    id="attachmentFiles"
                                    accept="application/pdf"
                                    multiple
                                    onChange={handleFileChange}
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


                        <div className="comments-list">
                            <h3>All Comments</h3>
                            {comments && comments.length > 0 ? (
                                comments.map((comment, index) => (
                                    <div key={index} className="review-card">
                                        <div className="review-header">
                                            <div className="review-user">
                                                <div className="user-info">
                                                    <p className="student-name"><strong>{comment.student.name}</strong>
                                                    </p>
                                                    <p className="user-email"><small>{comment.student.email}</small></p>
                                                </div>
                                            </div>
                                            <div className="review-date">
                                                <p>{new Date(comment.date).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                            <button onClick={() => toggleAttachments(comment.id)}>
                                                {expandedComments.has(comment.id) ? 'Hide Attachments' : 'Show Attachments'}
                                            </button>

                                        {expandedComments.has(comment.id) && (
                                            <>
                                                {attachmentsMap[comment.id]?.length > 0 ? (
                                                    <ul className="attachments-list">
                                                        {attachmentsMap[comment.id].map((att) => {
                                                            return (
                                                                <li key={att.id} className="attachment-item">
                                                                    <div className="attachment-details">
                                                                        <FaFilePdf size={24} color="#ff6f61" style={{ cursor: 'pointer' }} />
                                                                        <a
                                                                            href={att.fileUrl}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="attachment-link"
                                                                        >
                                                                            {att.originalFileName}
                                                                        </a>
                                                                    </div>
                                                                </li>
                                                            );
                                                        })}
                                                    </ul>
                                                ) : (
                                                    <div className="no-attachments">
                                                        <p>No attachments available for this comment.</p>
                                                    </div>
                                                )}
                                            </>
                                        )}


                                        <div className="review-body">
                                            <p>{comment.commentBody}</p>
                                        </div>

                                        {studentEmail === comment.student.email && (
                                            <div className="comment-buttons">
                                                <button onClick={() => handleDeleteButton(comment.id)}>Delete</button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="no-reviews">No comments yet. Start a conversation!</p>
                            )}
                        </div>

                    </div>
                )}
            </div>
        </>
    );
};

export default CourseReviewPage;

