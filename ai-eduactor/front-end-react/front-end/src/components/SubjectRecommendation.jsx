import React, { useEffect, useState } from 'react';
import './SubjectRecommendation.css';
import {  getCourses, getCourseRecommendations } from '../repository/api';

const SubjectRecommendation = () => {
    const [allSubjects, setAllSubjects] = useState([]);
    const [selectedSubjects, setSelectedSubjects] = useState([]);
    const [recommendedSubjects, setRecommendedSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setAllSubjects(data);
            } catch (err) {
                console.error('Error fetching courses:', err);
                setError('Failed to load courses.');
            }
        };

        fetchCourses();
    }, []);

    const handleSubjectToggle = (subject) => {
        if (selectedSubjects.includes(subject)) {
            setSelectedSubjects(selectedSubjects.filter(s => s !== subject));
        } else {
            setSelectedSubjects([...selectedSubjects, subject]);
        }
    };

    const fetchRecommendations = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await getCourseRecommendations(selectedSubjects);
            setRecommendedSubjects(data.recommended_courses || []);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommendation-page">
            <header className="navbar">
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/">Semesters</a></li>
                        <li><a href="/">Flash cards</a></li>
                        <li><a href="/">Subject Recommendation</a></li>
                        <li><a href="/">Comments</a></li>
                    </ul>
                </nav>
                <button className="logout-button">Log out</button>
            </header>

            <main className="recommendation-main">
                <h2>Subject Recommendation for Students</h2>
                <p>Select subjects you know best and get AI-generated suggestions based on your profile.</p>

                <div className="lists-container">
                    <div className="list-box">
                        <h4>Select subjects you know best</h4>
                        <ul>
                            {allSubjects.map((item, index) => (
                                <li key={index} onClick={() => handleSubjectToggle(item)}>
                                    <span className="avatar">{item[0]}</span>
                                    <span className="item-text">{item}</span>
                                    <input type="checkbox" checked={selectedSubjects.includes(item)} readOnly />
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* This is the part where you show the currently selected subjects */}
                    {selectedSubjects.length > 0 && (
                        <div className="selected-box">
                            <h4>Currently selected subjects:</h4>
                            <ul>
                                {selectedSubjects.map((subj, idx) => (
                                    <li key={idx}>{subj}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="list-box">
                        <h4>AI recommended subjects for you</h4>
                        {loading ? (
                            <p>Loading recommendations...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <ul>
                                {recommendedSubjects.map((item, index) => (
                                    <li key={index}>
                                        <span className="avatar">{item[0]}</span>
                                        <span className="item-text">{item}</span>
                                        <input type="checkbox" checked readOnly />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <button className="submit-button" onClick={fetchRecommendations}>
                    Submit and get Recommended subjects
                </button>
            </main>
        </div>
    );
};

export default SubjectRecommendation;
