import React, {useState, useEffect} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {FiUpload, FiZap, FiDownload} from 'react-icons/fi';
import {FaPlay} from 'react-icons/fa';
import {Spinner} from "react-bootstrap";
import CustomNavbar from './app-custom/CustomNavbar';
import Notification from './app-custom/Notification';
import {
    getCourses,
    uploadCourseAttachment,
    generateFlashCards,
    exportFlashCards
} from '../services/api';
import './FlashcardCourseSelector.css';

const FlashcardCourseSelector = () => {
    const location = useLocation();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [numFlashcards, setNumFlashcards] = useState(3);
    const [isUploading, setIsUploading] = useState(false);
    const [attachment, setAttachment] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                setNotification({
                    message: "Failed to fetch courses. Please try again!",
                    type: "error"
                });
            }
        };
        fetchCourses();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type === "application/pdf") {
            setSelectedFile(file);
        } else {
            setNotification({
                message: "Please upload a valid PDF file.",
                type: "error"
            });
            setSelectedFile(null);
        }
    };

    const handleUploadAndGenerate = async () => {
        if (!selectedFile || !selectedCourse) {
            setNotification({
                message: "Please select both a course and a PDF file.",
                type: "error"
            });
            return;
        }
        setIsUploading(true);
        setNotification(null);
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("courseId", selectedCourse);
            const uploadedFile = await uploadCourseAttachment(formData);
            setAttachment(uploadedFile);

            setIsUploading(false);
            setIsGenerating(true);
            await generateFlashCards(uploadedFile.id, numFlashcards);
            setIsGenerating(false);
            setIsGenerated(true);
            setNotification({
                message: "Flashcards generated successfully!",
                type: "success"
            });
        } catch (error) {
            setIsUploading(false);
            setIsGenerating(false);
            setNotification({
                message: error.response?.data || "Failed to generate flashcards. Please try again!",
                type: "error"
            });
        }
    };

    const handleDownload = async () => {
        try {
            const url = await exportFlashCards(selectedCourse);
            window.open(url, "_blank");
        } catch (error) {
            setNotification({
                message: "Failed to download flashcards. Please try again!",
                type: "error"
            });
        }
    };

    const handlePlayGame = () => {
        navigate(`/flashcard-game/${selectedCourse}`, {
            state: {
                from: location.pathname,
                isIndividual: true,
                attId: attachment.id
            }
        });
    };

    return (
        <>
            <CustomNavbar/>
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="fc-main-wrapper">
                <h1 className="fc-heading">
                    Generate your flash cards here!
                </h1>
                <p className="fc-instructions">
                    Please upload your notes or learning material as a PDF and select the number of flashcards you'd
                    like to create.
                </p>
                <div className="fc-content-grid">
                    <div className="fc-upload-container">
                        <div className="fc-dropdown-box">
                            <label htmlFor="course-select" className="fc-form-label">
                                Choose course:
                            </label>
                            <select
                                id="course-select"
                                className="fc-dropdown"
                                value={selectedCourse}
                                onChange={e => {
                                    setSelectedCourse(e.target.value);
                                    setIsGenerated(false);
                                }}
                                disabled={isUploading || isGenerating}
                            >
                                <option value="">Select course...</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="fc-upload-box">
                            <div className="fc-upload-title">
                                <FiUpload size={24}/>
                                <span>Upload PDF</span>
                            </div>
                            <label htmlFor="file-upload" className="fc-upload-label">
                                {selectedFile ? selectedFile.name : "Choose PDF File"}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{display: "none"}}
                            />
                        </div>
                        <div className="fc-slider-box">
                            <label htmlFor="num-flashcards" className="fc-form-label">
                                Select number of flashcards: <b>{numFlashcards}</b>
                            </label>
                            <div className="fc-slider-container">
                                <input
                                    id="num-flashcards"
                                    type="range"
                                    min={1}
                                    max={5}
                                    value={numFlashcards}
                                    onChange={e => setNumFlashcards(Number(e.target.value))}
                                    className="fc-slider"
                                    disabled={isUploading || isGenerating}
                                />
                                <div className="fc-slider-labels">
                                    <span>1</span>
                                    <span>2</span>
                                    <span>3</span>
                                    <span>4</span>
                                    <span>5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fc-action-panel">
                        {!isGenerated ? (
                            <button
                                className="fc-generate-btn"
                                onClick={handleUploadAndGenerate}
                                disabled={!selectedFile || !selectedCourse || isUploading || isGenerating}
                            >
                                {isUploading || isGenerating ? (
                                    <>
                                        Processing... <Spinner animation="border" size="sm"/>
                                    </>
                                ) : (
                                    <>
                                        <FiZap style={{marginRight: 4}}/>
                                        Generate
                                    </>
                                )}
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleDownload}
                                    className="fc-generate-btn"
                                >
                                    <FiDownload style={{marginRight: 4}}/>
                                    Download
                                </button>
                                <button
                                    onClick={handlePlayGame}
                                    className="fc-generate-btn"
                                >
                                    <FaPlay style={{marginRight: 4}}/>
                                    Play game
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default FlashcardCourseSelector;
