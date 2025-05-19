import React, {useEffect, useState} from 'react';
import './SubjectRecommendation.css';
import {getCourses, getCourseRecommendations} from '../../services/api';
import CustomNavbar from '../app-custom/CustomNavbar';

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
            const response = await getCourseRecommendations(selectedSubjects);
            console.log('Recommended Courses:', response);

            setRecommendedSubjects(response.recommended_courses || []);
        } catch (err) {
            console.error('Error fetching recommendations:', err);
            setError('Failed to fetch recommendations.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="recommendation-page">
            <CustomNavbar/>
            <div className="recommendation-hero">
                <div className="recommendation-main">
                    <h1>Subject Recommendation</h1>
                    <p>
                        Experience personalized course recommendations powered by AI. Select the subjects 
                        you excel in, and let our intelligent system analyze your preferences to suggest 
                        complementary courses that align with your academic strengths and interests. 
                        Discover new learning opportunities tailored just for you.
                    </p>
                </div>
            </div>

            <div className="recommendation-content">
                <div className="lists-container">
                    <div className="list-box">
                        <h4>Select subjects you know best</h4>
                        <ul>
                            {allSubjects.map((item) => (
                                <li
                                    key={item.id}
                                    className={
                                        selectedSubjects.includes(item.title)
                                            ? 'selected'
                                            : ''
                                    }
                                    onClick={() => handleSubjectToggle(item.title)}
                                >
                                    <span className="avatar">{item.title[0]}</span>
                                    <span className="item-text">{item.title}</span>
                                    <input
                                        type="checkbox"
                                        checked={selectedSubjects.includes(item.title)}
                                        readOnly
                                    />
                                    {selectedSubjects.includes(item.title) && (
                                        <span className="checkmark">&#10003;</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="selected-box" style={{
                        background: selectedSubjects.length === 0 ? '#fff' : undefined
                    }}>
                        <h4>Currently selected subjects:</h4>
                        <div className="selected-chips">
                            {selectedSubjects.length === 0 ? (
                                <span className="placeholder empty-placeholder" style={{color: '#000'}}>
                                    No subjects selected.
                                </span>
                            ) : (
                                selectedSubjects.map((subj, idx) => (
                                    <span className="chip" key={idx}>
                                        {subj}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="list-box">
                        <h4>AI recommended subjects for you</h4>
                        {loading ? (
                            <p>Loading recommendations...</p>
                        ) : error ? (
                            <p className="error">{error}</p>
                        ) : (
                            <ul>
                                {recommendedSubjects && recommendedSubjects.length > 0 ? (
                                    recommendedSubjects.map((item) => (
                                        <li key={item.id} className="recommended">
                                            <span className="avatar">{item.title[0]}</span>
                                            <span className="item-text">{item.title}</span>
                                            <span className="recommend-icon" title="Recommended">&#9733;</span>
                                        </li>
                                    ))
                                ) : (
                                    <p>No recommendations available at the moment.</p>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <button className="submit-button" onClick={fetchRecommendations}>
                    Get AI Recommendations
                </button>
            </div>
        </div>
    );
};

export default SubjectRecommendation;
