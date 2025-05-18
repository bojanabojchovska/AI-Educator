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
    const navigate = useNavigate();

    const [favorites, setFavorites] = useState({});
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);

    useEffect(() => {
        fetchCourses();
        fetchFavorites()
    }, []);

    const fetchCourses = async () => {
        try {
            setError(null);
            const data = await getCourses();
            console.log(data);
            const formattedCourses = data.map(course => ({
                id: course.id,
                name: course.title,
                avgRating: course.avgRating
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
            console.log(data);
            const favoriteMap = {};

            data.forEach(course => {
                favoriteMap[course.id] = true;
            });

            setFavorites(favoriteMap);

        } catch (err) {
            console.error('Error fetching favorites:', err);
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        const matchesSearch = !searchQuery || subject?.name?.toLowerCase().includes(searchQuery.toLowerCase());
        const isFavorite = favorites[subject.id];

        return matchesSearch && (!showOnlyFavorites || isFavorite);
    });

    const handleToggleFavorite = async (courseId) => {
        try {
            const isCurrentlyFavorite = favorites[courseId];

            if (isCurrentlyFavorite) {
                await removeCourseFromFavorites(courseId);
            } else {
                await addCourseToFavorites(courseId);
            }

            setFavorites(prev => ({
                ...prev,
                [courseId]: !isCurrentlyFavorite
            }));
        } catch (err) {
            console.error('Error updating favorite:', err);
        }
    };

    return (
        <>
            <CustomNavbar/>
            <div className="header-section">
                <h1>Course Hub</h1>
                <p>Welcome to the Course Hub – your all-in-one space for academic collaboration and engagement.
                    Here, you can mark your favorite courses for easy access, rate and review them based on your experience,
                    and share valuable feedback with your peers. The hub also allows you to upload and access study materials,
                    enabling file-sharing between students. Plus, you can take default quizzes created from the flashcards contributed
                    by other students in your course – making learning more dynamic and collective.
                    Whether you're looking to contribute, explore, or stay organized, the Course Hub keeps you connected and informed.</p>
                <div className="header-controls">
                    <div className="filter-toggle-container">
                        <button
                            className={`filter-toggle-button ${showOnlyFavorites ? 'active' : ''}`}
                            onClick={() => setShowOnlyFavorites(prev => !prev)}
                        >
                            {showOnlyFavorites ? 'Show All Courses' : 'Show Favorites Only'}
                        </button>
                    </div>
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
            </div>


            {error && <div className="global-error-message">{error}</div>}

            <div className="subject-reviews-container">

                <div className="subjects-grid">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map(subject => (
                            <div
                                key={subject.id}
                                className="subject-box clickable"
                                onClick={() => navigate(`/course/${subject.id}/reviews`)}
                            >
                                <div className="subject-title-row">
                                    <h3>{subject.name}</h3>
                                    <button
                                        className="heart-button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // prevent card click
                                            handleToggleFavorite(subject.id);
                                        }}
                                        aria-label="Toggle Favorite"
                                    >
                                        {favorites[subject.id] ? (
                                            <FaHeart className="subject-heart-icon"/>
                                        ) : (
                                            <FaRegHeart className="subject-heart-icon"/>
                                        )}
                                    </button>
                                </div>

                                <div className="rating-container">
                                    <label>Average Rating:</label>
                                    <StarRatings
                                        rating={subject.avgRating || 0}
                                        starRatedColor="#ffc107"
                                        numberOfStars={5}
                                        name={`avg-rating-${subject.id}`}
                                        starDimension="25px"
                                        starSpacing="2px"
                                        starEmptyColor="#ddd"
                                        isSelectable={false}
                                    />
                                    <span className="avg-rating-value">
            {subject.avgRating ? subject.avgRating.toFixed(1) : 'No rating yet'}
        </span>
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

