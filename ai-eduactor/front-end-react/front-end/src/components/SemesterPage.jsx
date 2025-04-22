import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import CustomNavbar from './CustomNavbar';
import './HomePage.css';
import './SemesterPage.css';
import { getSemesters, getCourses, createSemester, deleteSemester } from '../repository/api';
import { useNavigate } from 'react-router-dom';
import Notification from './Notification';

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
const [notification, setNotification] = useState({ message: '', type: '' });
const [editingSemesterId, setEditingSemesterId] = useState(null);


const fetchCourses = async () => {
    try {
        const response = await getCourses();
        console.log("Fetched courses:", response);
        if (Array.isArray(response)) {
            setAvailableSubjects(response.map(course => course.title));
        } else {
            console.error('Fetched courses is not an array:', response);
        }
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
    setEditingSemesterId(null);
    fetchCourses(); // To reset availableSubjects
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

        const response = await getSemesters(email, token);
        console.log("Fetched semesters:", response);

        if (Array.isArray(response)) {
            setSemesters(response);
        } else {
            console.error('Response is not an array:', response);
        }
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
    const semesterToEdit = semesters.find(s => s.id === id);
    if (semesterToEdit) {
        setEditingSemesterId(semesterToEdit.id);
        setSemesterName(semesterToEdit.name);
        setChosenSubjects(semesterToEdit.courses || []);
        const remainingSubjects = availableSubjects.filter(
            course => !semesterToEdit.courses.includes(course)
        );
        setAvailableSubjects(remainingSubjects);
        setShowModal(true);
    }
};


    const handleDelete = async (id) => {
        try {

            await deleteSemester(id);
            await fetchSemesters();
            setNotification({
                message: 'Semester deleted successfully.',
                type: 'success',
            });
        } catch (error) {

            setNotification({
                message: 'Failed to delete semester. Please try again.',
                type: 'error',
            });
        }
    };
    

    const isSaveDisabled = semesterName.trim() === '' || chosenSubjects.length === 0;


    return (
        <>
            <CustomNavbar />
            {notification.message && (
            <Notification
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification({ message: '', type: '' })}
            />
        )}
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
                                    {semester.courses && semester.courses.length > 0 ? (
                                        semester.courses.map((course, index) => (
                                            <li key={index}>{course}</li>
                                        ))
                                    ) : (
                                        <li>No courses added.</li>
                                    )}
                                </ul>
                                <div className="card-buttons">
    <button className="btn me-3" onClick={() => handleEdit(semester.id)}>
        <i className="fas fa-pen me-1"></i> Edit
    </button>
    <button className="btn" onClick={() => handleDelete(semester.id)}>
        <i className="fas fa-trash-alt me-1"></i> Delete
    </button>
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
        <Modal.Title>{editingSemesterId ? 'EDIT SEMESTER' : 'CREATE SEMESTER'}</Modal.Title>
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
    onClick={async () => {
        const email = localStorage.getItem("email");
        const semesterData = {
            id: editingSemesterId,
            name: semesterName,
            courses: chosenSubjects,
        };

        try {
            await createSemester(semesterData, email); // This handles both create/update
            await fetchSemesters();
            closeModal();
        } catch (error) {
            console.error('Failed to save semester:', error);
        }
    }}
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
