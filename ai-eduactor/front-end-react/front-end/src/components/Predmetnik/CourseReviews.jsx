import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseReviews.css';
import CustomNavbar from '../app-custom/CustomNavbar';
import {
    addCourseToFavorites,
    getCourses,
    getFavoriteCourses,
    removeCourseFromFavorites,
    submitSubjectReview
} from '../../services/api';
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import StarRatings from 'react-star-ratings';

const CourseReviews = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState({});
    const [successMessages, setSuccessMessages] = useState({});
    const [isSubmitting, setIsSubmitting] = useState({});
    const [favoritesFirst, setFavoritesFirst] = useState(false);
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState({});

    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteCourses');
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
        fetchCourses();
        fetchFavorites();
    }, []);

    const fetchCourses = async () => {
        try {
            setError(null);
            const data = await getCourses();
            console.log(data);
            const formattedCourses = data.map(course => ({
                id: course.id,
                name: course.title,
            }));
            setSubjects(formattedCourses);
        } catch (err) {
            setError('Failed to fetch courses. Please try again later.');
            console.error('Error fetching courses:', err);
        }
    };

    const fetchFavorites = async () => {
        try {
            const data = await getFavoriteCourses();
            const favoriteMap = {};

            data.forEach(course => {
                favoriteMap[course.id] = true;
            });

            setFavorites(favoriteMap);
            localStorage.setItem('favoriteCourses', JSON.stringify(favoriteMap));
        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const handleSubmitReview = async (courseId) => {
        const review = reviews[courseId];
        if (!review || !review.rating) {
            setReviews(prev => ({
                ...prev,
                [courseId]: {
                    ...prev[courseId],
                    error: 'Please provide a rating'
                }
            }));
            return;
        }

        setReviews(prev => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                error: null
            }
        }));
        setIsSubmitting(prev => ({ ...prev, [courseId]: true }));

        try {
            await submitSubjectReview(courseId, {
                rating: review.rating,
                feedback: review.feedback || ''
            });

            setReviews(prev => ({
                ...prev,
                [courseId]: { rating: 0, feedback: '', error: null }
            }));

            setSuccessMessages(prev => ({
                ...prev,
                [courseId]: true
            }));

            setTimeout(() => {
                setSuccessMessages(prev => ({
                    ...prev,
                    [courseId]: false
                }));
            }, 3000);

        } catch (err) {
            console.error('Error submitting review:', err);
            setReviews(prev => ({
                ...prev,
                [courseId]: {
                    ...prev[courseId],
                    error: typeof err === 'string' ? err : 'Failed to submit review. Please try again.'
                }
            }));
        } finally {
            setIsSubmitting(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const handleRatingClick = (courseId, rating) => {
        setReviews(prev => ({
            ...prev,
            [courseId]: { ...prev[courseId], rating: parseFloat(rating), error: null }
        }));
    };

    const handleFeedbackChange = (courseId, feedback) => {
        setReviews(prev => ({
            ...prev,
            [courseId]: { ...prev[courseId], feedback, error: null }
        }));
    };

    const filteredSubjects = subjects.filter(subject => {
        if (!searchQuery) return true;
        return subject?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const sortedSubjects = favoritesFirst
        ? [...filteredSubjects].sort((a, b) => {
            const aFav = !!favorites[a.id];
            const bFav = !!favorites[b.id];
            if (aFav === bFav) return 0;
            return aFav ? -1 : 1;
        })
        : filteredSubjects;

    const handleViewAllReviews = (courseId) => {
        navigate(`/course/${courseId}/reviews`);
    };

    const handleToggleFavorite = async (courseId) => {
        try {
            const isCurrentlyFavorite = favorites[courseId];

            if (isCurrentlyFavorite) {
                await removeCourseFromFavorites(courseId);
            } else {
                await addCourseToFavorites(courseId);
            }

            setFavorites(prev => {
                const updated = { ...prev, [courseId]: !isCurrentlyFavorite };
                localStorage.setItem('favoriteCourses', JSON.stringify(updated));
                return updated;
            });
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="header-section">
                <h1>Course Reviews</h1>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
            </div>

            {error && <div className="global-error-message">{error}</div>}

            <div className="subject-reviews-container">

                <div className="favorites-toggle-row">
                    <button
                        className={`favorites-toggle-btn${favoritesFirst ? ' active' : ''}`}
                        onClick={() => setFavoritesFirst(f => !f)}
                    >
                        {favoritesFirst ? 'Showing Favorites First' : 'Show Favorites First'}
                    </button>
                </div>

                <div className="subjects-grid">
                    {sortedSubjects.length > 0 ? (
                        sortedSubjects.map(subject => (
                            <div
                                key={subject.id}
                                className="subject-box subject-box-clickable"
                                tabIndex={0}
                                role="button"
                                onClick={e => {
                                    if (
                                        e.target.closest('.heart-button') ||
                                        e.target.closest('.review-textarea') ||
                                        e.target.closest('.button-container') ||
                                        e.target.closest('.rating-container')
                                    ) {
                                        return;
                                    }
                                    navigate(`/course/${encodeURIComponent(subject.name)}`);
                                }}
                                onKeyDown={e => {
                                    if (
                                        (e.key === 'Enter' || e.key === ' ') &&
                                        !(
                                            e.target.closest('.heart-button') ||
                                            e.target.closest('.review-textarea') ||
                                            e.target.closest('.button-container') ||
                                            e.target.closest('.rating-container')
                                        )
                                    ) {
                                        navigate(`/course/${encodeURIComponent(subject.name)}`);
                                    }
                                }}
                            >
                                <div className="subject-title-row">
                                    <h3>{subject.name}</h3>
                                    <button
                                        className="heart-button"
                                        onClick={e => {
                                            e.stopPropagation();
                                            handleToggleFavorite(subject.id);
                                        }}
                                        aria-label="Toggle Favorite"
                                    >
                                        {favorites[subject.id] ? (
                                            <FaHeart className={"subject-heart-icon"} />
                                        ) : (
                                            <FaRegHeart className={"subject-heart-icon"} />
                                        )}
                                    </button>
                                </div>
                                <div className="subject-box-content">
                                    {successMessages[subject.id] && (
                                        <div className="success-message">Review submitted successfully!</div>
                                    )}

                                    {reviews[subject.id]?.error && (
                                        <div className="error-message">{reviews[subject.id].error}</div>
                                    )}

                                    <div className="rating-container" onClick={e => e.stopPropagation()}>
                                        <label>Your Rating:</label>
                                        <StarRatings
                                            rating={reviews[subject.id]?.rating || 0}
                                            starRatedColor="#ffc107"
                                            changeRating={rating => handleRatingClick(subject.id, rating)}
                                            numberOfStars={5}
                                            name={`rating-${subject.id}`}
                                            starDimension="25px"
                                            starSpacing="2px"
                                            starHoverColor="#ffc107"
                                            starEmptyColor="#ddd"
                                            isHalf={true}
                                        />
                                    </div>

                                    <textarea
                                        placeholder="Write your feedback here (optional)..."
                                        value={reviews[subject.id]?.feedback || ''}
                                        onChange={e => handleFeedbackChange(subject.id, e.target.value)}
                                        className="review-textarea"
                                        onClick={e => e.stopPropagation()}
                                    />

                                    <div className="button-container" onClick={e => e.stopPropagation()}>
                                        <button
                                            className="submit-btn"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleSubmitReview(subject.id);
                                            }}
                                            disabled={isSubmitting[subject.id]}
                                        >
                                            {isSubmitting[subject.id] ? 'Submitting...' : 'Submit Review'}
                                        </button>

                                        <button
                                            className="view-all-btn"
                                            onClick={e => {
                                                e.stopPropagation();
                                                handleViewAllReviews(subject.id, subject.name);
                                            }}
                                        >
                                            View All Reviews
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">No courses found matching "{searchQuery}"</div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CourseReviews;

