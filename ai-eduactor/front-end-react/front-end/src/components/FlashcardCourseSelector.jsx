import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { FiUpload } from 'react-icons/fi';
import CustomNavbar from './app-custom/CustomNavbar';
import { Spinner } from 'react-bootstrap';
import Notification from './app-custom/Notification';
import {
    getCourses,
    uploadCourseAttachment,
    generateFlashCards,
    exportFlashCards,
} from '../services/api';

const FlashcardCourseSelector = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [numFlashcards, setNumFlashcards] = useState(1);
    const [isUploading, setIsUploading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isGenerated, setIsGenerated] = useState(false);
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
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
        fetchData();
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
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("courseId", selectedCourse);
            const uploadedFile = await uploadCourseAttachment(formData);

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
                message: error.response?.data || "Failed to upload or generate flashcards. Please try again!",
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
        navigate(`/flashcard-game/${selectedCourse}`);
    };

    return (
        <>
            <CustomNavbar />
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            <div className="container mt-5">
                <div className="course-details-section">
                    <h1 className="course-details-title">Generate Flashcards</h1>
                    <p className="course-details-description">
                        Select a course, upload your PDF, and generate flashcards to study with.
                    </p>
                </div>

                {!isGenerated ? (
                    <div className="upload-container">
                        <div className="form-group mb-4">
                            <label className="form-label">Select Course:</label>
                            <select
                                className="form-select"
                                value={selectedCourse}
                                onChange={(e) => setSelectedCourse(e.target.value)}
                                disabled={isUploading || isGenerating}
                            >
                                <option value="">-- Choose a course --</option>
                                {courses.map(course => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="upload-box">
                            <label htmlFor="file-upload" className="custom-upload-label">
                                <FiUpload size={20} />
                                {selectedFile ? selectedFile.name : "Choose PDF File"}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </div>

                        <div className="form-group mb-4">
                            <label htmlFor="num-flashcards" className="form-label">Number of Flashcards:</label>
                            <input
                                id="num-flashcards"
                                type="number"
                                min={1}
                                max={20}
                                value={numFlashcards}
                                onChange={e => setNumFlashcards(Number(e.target.value))}
                                disabled={isUploading || isGenerating}
                                className="form-control"
                                style={{ width: "100px" }}
                            />
                        </div>

                        <div className="flashcards-buttons">
                            <button
                                className="flashcards-button"
                                onClick={handleUploadAndGenerate}
                                disabled={!selectedFile || !selectedCourse || isUploading || isGenerating}
                            >
                                {isUploading || isGenerating ? (
                                    <>
                                        Processing... <Spinner animation="border" size="sm" />
                                    </>
                                ) : (
                                    "Upload & Generate"
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flashcards-buttons" style={{ marginTop: "2rem" }}>
                        <button
                            onClick={handleDownload}
                            className="flashcards-button"
                            style={{ marginRight: "1rem" }}
                        >
                            Download
                        </button>
                        <button
                            onClick={handlePlayGame}
                            className="flashcards-button"
                        >
                            Play Game
                        </button>
                    </div>
                )}
            </div>
        </>
    );
};

export default FlashcardCourseSelector;
