import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FiUpload, FiDownload } from 'react-icons/fi';
import { FaPlay, FaRobot, FaTrash } from 'react-icons/fa';
import CustomNavbar from './app-custom/CustomNavbar';
import { Spinner } from 'react-bootstrap';
import Notification from './app-custom/Notification';
import {
    getCourses,
    uploadCourseAttachment,
    generateFlashCards,
    exportFlashCards,
    getCourseAttachments,
    getFlashCardsByCourseAndUser,
    deleteAttachment,
    exportPdfFlashcards
} from '../services/api';

const FlashcardCourseSelector = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [numFlashcards, setNumFlashcards] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [notification, setNotification] = useState(null);
    const [isGenerated, setIsGenerated] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [flashCards, setFlashCards] = useState([]);
    const [attachmentStates, setAttachmentStates] = useState({});

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourses();
                setCourses(data);

                if (selectedCourse) {
                    const courseAttachments = await getCourseAttachments(selectedCourse);
                    setAttachments(courseAttachments);

                    const flashCards = await getFlashCardsByCourseAndUser(selectedCourse);
                    setFlashCards(flashCards);

                    const initialStates = {};
                    courseAttachments.forEach((attachment) => {
                        const hasFlashcards = flashCards.some(
                            (fc) => fc.attachmentId === attachment.id
                        );
                        initialStates[attachment.id] = {
                            numFlashcards: 1,
                            isGenerating: false,
                            isGenerated: hasFlashcards,
                        };
                    });
                    setAttachmentStates(initialStates);
                }
            } catch (error) {
                setNotification({
                    message: "Failed to fetch data. Please try again!",
                    type: "error"
                });
            }
        };
        fetchData();
    }, [selectedCourse]);

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
            setAttachments(prev => [...prev, uploadedFile]);
            setNotification({
                message: "File uploaded successfully!",
                type: "success"
            });
            setSelectedFile(null);
        } catch (error) {
            setNotification({
                message: error.response?.data || "Failed to upload file. Please try again!",
                type: "error"
            });
        } finally {
            setIsUploading(false);
        }
    };

    const handleNumChange = (attachmentId, value) => {
        setAttachmentStates(prev => ({
            ...prev,
            [attachmentId]: {
                ...prev[attachmentId],
                numFlashcards: value
            }
        }));
    };

    const handleGenerate = async (attachmentId) => {
        setAttachmentStates(prev => ({
            ...prev,
            [attachmentId]: {
                ...prev[attachmentId],
                isGenerating: true
            }
        }));

        try {
            const numCards = attachmentStates[attachmentId]?.numFlashcards || 1;
            const newFlashCards = await generateFlashCards(attachmentId, numCards);
            setFlashCards(prev => [...prev, ...newFlashCards]);

            setAttachmentStates(prev => ({
                ...prev,
                [attachmentId]: {
                    ...prev[attachmentId],
                    isGenerating: false,
                    isGenerated: true
                }
            }));

            setNotification({
                message: "Flashcards generated successfully!",
                type: "success"
            });
        } catch (error) {
            setAttachmentStates(prev => ({
                ...prev,
                [attachmentId]: {
                    ...prev[attachmentId],
                    isGenerating: false
                }
            }));
            setNotification({
                message: error.response?.data || "Failed to generate flashcards. Please try again!",
                type: "error"
            });
        }
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const url = await exportFlashCards(selectedCourse);
            window.open(url, "_blank");
            setNotification({
                message: "Successfully exported flashcards to PDF!",
                type: "success"
            });
        } catch (error) {
            setNotification({
                message: "Failed to download flashcards. Please try again!",
                type: "error"
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePdfDownload = async (attachmentId) => {
        setIsDownloading(true);
        try {
            const pdfUrl = await exportPdfFlashcards(attachmentId);
            window.open(pdfUrl, "_blank");
            setNotification({
                message: "Successfully exported flashcards to PDF!",
                type: "success"
            });
        } catch (error) {
            setNotification({
                message: "Failed to download flashcards. Please try again!",
                type: "error"
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePlayGame = () => {
        navigate(`/flashcard-game/${selectedCourse}`);
    };

    const handleChatBot = () => {
        navigate(`/chatbot`, {
            state: {
                from: location.pathname,
                attachments,
                courseId: selectedCourse,
                courseName: courses.find(c => c.id === selectedCourse)?.title
            }
        });
    };

    const handleDelete = async (attachmentId) => {
        try {
            await deleteAttachment(attachmentId);
            setAttachments(prev => prev.filter(attachment => attachment.id !== attachmentId));
            setFlashCards(prev => prev.filter(fc => fc.attachmentId !== attachmentId));
            setNotification({
                message: "Attachment deleted successfully!",
                type: "success"
            });
        } catch (error) {
            setNotification({
                message: error.response?.data || "Failed to delete the attachment. Please try again.",
                type: "error"
            });
        }
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

                    <div className="flashcards-buttons">
                        <button
                            className="flashcards-button"
                            onClick={handleUploadAndGenerate}
                            disabled={!selectedFile || !selectedCourse || isUploading}
                        >
                            {isUploading ? (
                                <>
                                    Uploading... <Spinner animation="border" size="sm" />
                                </>
                            ) : (
                                "Upload PDF"
                            )}
                        </button>
                    </div>
                </div>

                <div className="attachments-section">
                    {flashCards != null && flashCards.length > 0 && (
                        <div className="d-flex justify-content-between">
                            <div>
                                <button
                                    onClick={handleDownload}
                                    className="flashcards-button"
                                    style={{marginRight: "1rem"}}
                                >
                                    Export All to PDF
                                </button>
                                {isDownloading && <Spinner animation="border" role="status"/>}
                                <button
                                    onClick={handlePlayGame}
                                    className="flashcards-button"
                                >
                                    Take Quiz
                                </button>
                            </div>

                            <button
                                className="chatbot-button"
                                style={{marginLeft: "1rem"}}
                                onClick={handleChatBot}
                            >
                                <FaRobot size={22} /> Open ChatBot
                            </button>
                        </div>
                    )}

                    <h2 className="uploaded-docs">Uploaded Documents</h2>
                    {attachments.length === 0 ? (
                        <p>No documents uploaded yet.</p>
                    ) : (
                        <ul className="attachment-list">
                            {attachments.map((attachment) => {
                                const state = attachmentStates[attachment.id] || {
                                    numFlashcards: 1,
                                    isGenerating: false,
                                    isGenerated: false
                                };

                                return (
                                    <li key={attachment.id} className="attachment-item">
                                        <a
                                            href={attachment.fileUrl.startsWith("http")
                                                ? attachment.fileUrl
                                                : `http://localhost:8080${attachment.fileUrl}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="pdf-link"
                                        >
                                            <i className="fas fa-file-pdf pdf-icon"></i>
                                            {attachment.originalFileName}
                                        </a>
                                        <div>
                                            <input
                                                type="number"
                                                value={state.numFlashcards}
                                                onChange={(e) => handleNumChange(attachment.id, e.target.value)}
                                                min="1"
                                                max="5"
                                            />

                                            <button
                                                onClick={() => handleGenerate(attachment.id)}
                                                className="flashcards-button"
                                                disabled={state.isGenerating}
                                            >
                                                {state.isGenerating ? (
                                                    <>
                                                        Generating... <Spinner animation="border" size="sm"/>
                                                    </>
                                                ) : (
                                                    "Generate Flashcards"
                                                )}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(attachment.id)}
                                                className="flashcards-button"
                                                title="Delete button"
                                            >
                                                <FaTrash/>
                                            </button>

                                            {state.isGenerated && (
                                                <>
                                                    <button
                                                        onClick={() => handlePdfDownload(attachment.id)}
                                                        className="icon-button"
                                                        title="Export to PDF"
                                                    >
                                                        <FiDownload size={18}/>
                                                        <span className="button-tooltip">Export to PDF</span>
                                                    </button>
                                                    <button
                                                        onClick={handlePlayGame}
                                                        className="icon-button"
                                                        title="Take a quiz"
                                                    >
                                                        <FaPlay size={16}/>
                                                        <span className="button-tooltip">Take a quiz</span>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

export default FlashcardCourseSelector;