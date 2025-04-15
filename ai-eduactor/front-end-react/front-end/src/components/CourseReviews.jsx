import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CourseReviews.css';
import CustomNavbar from './CustomNavbar';
import { getCourses } from '../repository/api';

const CourseReviews = () => {
    const [subjects, setSubjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getCourses();
            const formattedCourses = data.map(course => ({
                id: course.courseId || course.id,
                name: course.courseName || course.name || course.title,
            }));
            setSubjects(formattedCourses);
            setError(null);
        } catch (err) {
            setError('Failed to fetch subjects. Please try again later.');
            console.error('Error fetching subjects:', err);
        }
    };

    const filteredSubjects = subjects.filter(subject => {
        if (!searchQuery) return true;
        return subject?.name?.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleCourseClick = (courseId) => {
        navigate(`/course/${courseId}/reviews`);
    };

    return (
        <>
            <CustomNavbar />
            <div className="subject-reviews-container">
                <h1>Courses</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="subjects-grid">
                    {filteredSubjects.length > 0 ? (
                        filteredSubjects.map(subject => (
                            <div
                                key={subject.id}
                                className="subject-box"
                                onClick={() => handleCourseClick(subject.id)}
                            >
                                <h3>{subject.name}</h3>
                                <p>Click to view and add reviews</p>
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
