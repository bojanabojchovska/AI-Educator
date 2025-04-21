import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import CustomNavbar from './CustomNavbar';
import './HomePage.css';
import './SemesterPage.css'; // You can create custom styles here
import { getSemesters, getCourses } from '../repository/api'; // Adjust the path if needed
import { useNavigate } from 'react-router-dom';

const SemesterPage = () => {
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
const [semesterName, setSemesterName] = useState('');
const [availableSubjects, setAvailableSubjects] = useState([]);
const [chosenSubjects, setChosenSubjects] = useState([]);
const [selectedAvailable, setSelectedAvailable] = useState([]);
const [selectedChosen, setSelectedChosen] = useState([]);

const fetchCourses = async () => {
    try {
        const courses = await getCourses();
        setAvailableSubjects(courses.map(course => course.title));
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
};

const handleCreate = () => {
    setShowModal(true);
};

const closeModal = () => {
    setShowModal(false);
    setSemesterName('');
    setChosenSubjects([]);
};

const moveToChosen = () => {
    setAvailableSubjects(prev => prev.filter(sub => !selectedAvailable.includes(sub)));
    setChosenSubjects(prev => [...prev, ...selectedAvailable]);
    setSelectedAvailable([]);
};

const moveToAvailable = () => {
    setChosenSubjects(prev => prev.filter(sub => !selectedChosen.includes(sub)));
    setAvailableSubjects(prev => [...prev, ...selectedChosen]);
    setSelectedChosen([]);
};



    const fetchSemesters = async () => {
        try {
            const email = localStorage.getItem('email');
            const token = localStorage.getItem('token');

            const response = await getSemesters(email, token); // pass both
            setSemesters(response);
        } catch (error) {
            console.error('Failed to fetch semesters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchCourses();
    }, []);
    

    const handleEdit = (id) => {
        navigate(`/edit-semester/${id}`);
    };

    const handleDelete = (id) => {
        // Add delete logic here
        console.log('Delete semester with id:', id);
    };

    const isSaveDisabled = semesterName.trim() === '' || chosenSubjects.length === 0;


    return (
        <>
            <CustomNavbar />
            <div className="homepage-container">
                <header className="hero-header">
                    <div className="hero-title">
                        <h1>Semester Planning</h1>
                        <p>
                            Organize your academic journey efficiently by planning 
                            <br />
                            each semester with your selected subjects.
                        </p>
                    </div>
                </header>

                <div className="create-btn-wrapper">
                    <button className="btn create-semester-btn" onClick={handleCreate}>
                        Create Semester
                    </button>
                </div>

                <div className="semester-cards-container">
                    {loading ? (
                        <p>Loading semesters...</p>
                    ) : semesters.length > 0 ? (
                        semesters.map((semester) => (
                            <div key={semester.id} className="semester-card">
                                <h3>{semester.name}</h3>
                                <ul>
                                    {semester.subjects && semester.subjects.length > 0 ? (
                                        semester.subjects.map((subject, index) => (
                                            <li key={index}>{subject}</li>
                                        ))
                                    ) : (
                                        <li>No subjects added.</li>
                                    )}
                                </ul>
                                <div className="card-buttons">
                                    <button className="btn" onClick={() => handleEdit(semester.id)}>Edit</button>
                                    <button className="btn" onClick={() => handleDelete(semester.id)}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>
                            <p>You don't have any semesters.</p>
                        </div>
                    )}
                </div>

                <Modal show={showModal} onHide={closeModal} centered>
    <Modal.Header closeButton>
        <Modal.Title>CREATE SEMESTER</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <label>Semester Name:</label>
    <input
        type="text"
        value={semesterName}
        onChange={(e) => setSemesterName(e.target.value)}
        className="modal-input form-control mb-4"
        placeholder="Enter semester name"
        required
    />

    <div className="dual-list-container">
        {/* Header Row */}
        <div className="d-flex justify-content-between mb-2">
            <div className="w-50 text-center">
                <h5>Chosen Subjects</h5>
            </div>
            <div className="mx-4"></div> {/* Spacer for arrows */}
            <div className="w-50 text-center">
                <h5>Available Subjects</h5>
            </div>
        </div>

        {/* Content Row */}
        <div className="d-flex justify-content-between align-items-start">
            {/* Chosen Subjects */}
            <div className="w-50 pe-2">
                <select
                    id="chosenSubjects"
                    multiple
                    size={5}
                    className="form-control"
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedChosen(selected);
                    }}
                >
                    {chosenSubjects.map((sub, index) => (
                        <option key={index} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>

            {/* Arrows */}
            <div className="arrows d-flex flex-column justify-content-center mx-2">
                <button className="btn arrow-btn mb-2" onClick={moveToChosen}>&larr;</button>
                <button className="btn arrow-btn" onClick={moveToAvailable}>&rarr;</button>
            </div>

            {/* Available Subjects */}
            <div className="w-50 ps-2">
                <select
                    id="availableSubjects"
                    multiple
                    size={5}
                    className="form-control"
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setSelectedAvailable(selected);
                    }}
                >
                    {availableSubjects.map((sub, index) => (
                        <option key={index} value={sub}>{sub}</option>
                    ))}
                </select>
            </div>
        </div>
    </div>
</Modal.Body>
<Modal.Footer className="d-flex justify-content-center">
    <button
        className="btn btn-primary"
        disabled={isSaveDisabled}
        onClick={() => {/* save logic */}}
    >
        Save
    </button>
</Modal.Footer>
</Modal>



                <footer>
                    <p>&copy; 2025 AI Educator</p>
                </footer>
            </div>
        </>
    );
};

export default SemesterPage;
