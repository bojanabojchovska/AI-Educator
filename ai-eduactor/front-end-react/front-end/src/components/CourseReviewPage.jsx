import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import CustomNavbar from './CustomNavbar';
import { getSubjectReviews, submitSubjectReview } from '../repository/api';

const CourseReviewPage = () => {
    const { courseId } = useParams();
    const [reviews, setReviews] = useState({ comments: [], averageRating: 0 });
    const [newReview, setNewReview] = useState({ rating: 0, feedback: '' });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [courseId]);

    const fetchReviews = async () => {
        try {
            const data = await getSubjectReviews(courseId);
            setReviews(data);
        } catch (err) {
            setError('Failed to fetch reviews');
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.rating) {
            alert('Please provide a rating');
            return;
        }

        try {
            await submitSubjectReview(courseId, newReview);
            setNewReview({ rating: 0, feedback: '' });
            fetchReviews(); // Refresh reviews after submission
            alert('Review submitted successfully!');
        } catch (err) {
            alert('Failed to submit review');
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="course-review-container">
                <div className="review-section">
                    <h2>Course Reviews</h2>
                    <p>Average Rating: {reviews.averageRating?.toFixed(1) || 'No ratings yet'}</p>

                    <form onSubmit={handleSubmitReview} className="new-review-form">
                        <h3>Add Your Review</h3>
                        <div className="rating-container">
                            {[1, 2, 3, 4, 5].map(star => (
                                <FaStar
                                    key={star}
                                    className={`star ${newReview.rating >= star ? 'active' : ''}`}
                                    onClick={() => setNewReview({...newReview, rating: star})}
                                />
                            ))}
                        </div>
                        <textarea
                            placeholder="Write your feedback here..."
                            value={newReview.feedback}
                            onChange={(e) => setNewReview({...newReview, feedback: e.target.value})}
                        />
                        <button type="submit" className="submit-btn">Submit Review</button>
                    </form>

                    <div className="reviews-list">
                        <h3>All Reviews</h3>
                        {reviews.comments.length > 0 ? (
                            reviews.comments.map((comment, index) => (
                                <div key={index} className="review-item">
                                    <p>{comment.content}</p>
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CourseReviewPage;
