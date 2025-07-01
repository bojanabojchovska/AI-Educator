import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiUpload, FiZap } from "react-icons/fi";
import CustomNavbar from "../app-custom/CustomNavbar";
import Notification from "../app-custom/Notification";
import {
  getCourseAttachments,
  getCourses,
  generateFlashCards,
  getFlashCardsByCourseAndUser,
  uploadCourseAttachment,
  exportFlashCards,
  exportPdfFlashcards,
  deleteAttachment,
} from "../../services/api";
import "./CoursePage.css";
import { Spinner } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { FiDownload } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import { FaRobot } from "react-icons/fa";

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [courseDetails, setCourseDetails] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const [attachmentStates, setAttachmentStates] = useState({});
  const [flashCards, setFlashCards] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courses = await getCourses();
        const course = courses.find((c) => c.title === courseName);
        setCourseDetails(course);

        if (course) {
          const courseAttachments = await getCourseAttachments(course.id);
          setAttachments(courseAttachments);

          const flashCards = await getFlashCardsByCourseAndUser(course.id);
          setFlashCards(flashCards);

          console.log(flashCards);

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
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseName]);

  const handleChooseFile = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setSelectedFile(selectedFile);
    } else {
      alert("Please upload a valid PDF file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseId", courseDetails.id);

    try {
      const data = await uploadCourseAttachment(formData);
      setNotification({
        message: "File " + data.originalFileName + " uploaded successfully!",
        type: "success",
      });
      setAttachments([...attachments, data]);
      setSelectedFile(null);
      setIsUploading(false);
    } catch (error) {
      setError(error);
      console.log("Upload error response:", error.response?.data);
      setNotification({
        message:
          error.response?.data || "Failed to upload pdf. Please try again!",
        type: "error",
      });
      setIsUploading(false);
    }
  };

  const handleNumChange = (attachmentId, value) => {
    setAttachmentStates((prev) => ({
      ...prev,
      [attachmentId]: {
        ...prev[attachmentId],
        numFlashcards: value,
      },
    }));
  };

  const handleGenerate = async (attachmentId) => {
    setAttachmentStates((prev) => ({
      ...prev,
      [attachmentId]: {
        ...prev[attachmentId],
        isGenerating: true,
      },
    }));

    try {
      const numFlashcards = attachmentStates[attachmentId]?.numFlashcards || 1;
      const newFlashCards = await generateFlashCards(
        attachmentId,
        numFlashcards
      );
      setFlashCards((prev) => [...prev, ...newFlashCards]);

      setAttachmentStates((prev) => ({
        ...prev,
        [attachmentId]: {
          ...prev[attachmentId],
          isGenerating: false,
          isGenerated: true,
        },
      }));

      setNotification({
        message: "Flashcards generated successfully!",
        type: "success",
      });
    } catch (error) {
      setAttachmentStates((prev) => ({
        ...prev,
        [attachmentId]: {
          ...prev[attachmentId],
          isGenerating: false,
        },
      }));
      console.error("Error generating flashcards:", error);
      setError(error);
      setNotification({
        message:
          error.response?.data ||
          "Failed to generate flashcards. Please try again!",
        type: "error",
      });
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const url = await exportFlashCards(courseDetails.id);
      setNotification({
        message: "Successfully exported flashcards to PDF!",
        type: "success",
      });
      setIsDownloading(false);

      window.open(url, "_blank");
    } catch (error) {
      setIsDownloading(false);
      console.error("Error downloading flashcards:", error);
      setError(error);
      setNotification({
        message:
          error.response?.data ||
          "Failed to download flashcards. Please try again!",
        type: "error",
      });
      alert(
        error.response?.data ||
          "Failed to download flashcards. Please try again!"
      );
    }
  };

  const handlePlayGame = (isIndividual, attId) => {
    navigate(`/flashcard-game/${courseDetails.id}`, {
      state: {
        from: location.pathname,
        isIndividual: isIndividual,
        attId: attId,
      },
    });
  };

  const handleChatBot = () => {
    navigate(`/chatbot`, {
      state: {
        from: location.pathname,
        attachments,
        courseId: courseDetails.id,
        courseName: courseDetails.title,
      },
    });
  };
  const handlePlayDemo = () => {
    navigate(`/flashcards/game/${courseDetails.id}`);
  };

  if (!courseDetails) {
    return (
      <div>
        Loading... <Spinner animation="border" role="status" />
      </div>
    );
  }

  const handleDelete = async (attachmentId) => {
    try {
      await deleteAttachment(attachmentId);
      setAttachments((prev) =>
        prev.filter((attachment) => attachment.id !== attachmentId)
      );
      setFlashCards((prev) =>
        prev.filter((fc) => fc.attachmentId !== attachmentId)
      );

      setNotification({
        message: "Attachment deleted successfully!",
        type: "success",
      });
    } catch (error) {
      console.error("Error deleting attachment: " + error);
      setNotification({
        message:
          error.response?.data ||
          "Failed to delete the attachment. Please try again.",
        type: "error",
      });
      setError(error);
    }
  };

  const handlePdfDownload = async (attachmentId) => {
    setIsDownloading(true); // Set downloading state to true
    try {
      const pdfUrl = await exportPdfFlashcards(attachmentId);
      setNotification({
        message: "Successfully exported flashcards to PDF!",
        type: "success",
      });
      setIsDownloading(false);

      window.open(pdfUrl, "_blank");
    } catch (error) {
      setIsDownloading(false); // Set downloading state to false
      console.error("Error during PDF export:", error);

      setError(error);
      setNotification({
        message:
          error.response?.data ||
          "Failed to download flashcards. Please try again!",
        type: "error",
      });

      alert(
        error.response?.data ||
          "Failed to download flashcards. Please try again!"
      );
    }
  };

  return (
    <>
      <CustomNavbar />
      <div className="coursepage-root">
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="course-details-section">
          <h1 className="course-details-title">{courseName}</h1>
          <p className="course-details-description">
            {courseDetails.description}
          </p>
        </div>

        <div className="upload-container">
          <h1 className="upload-title">Upload Your Course PDF</h1>
          <p className="upload-subtitle">
            Upload a PDF related to your course. You can generate flashcards,
            take a quiz, download them, and preview them anytime.
          </p>

          <div className="upload-box">
            <label htmlFor="file-upload" className="custom-upload-label">
              <FiUpload size={20} />
              {selectedFile ? selectedFile.name : "Choose PDF File"}
            </label>
            <input
              id="file-upload"
              type="file"
              accept="application/pdf"
              onChange={handleChooseFile}
              style={{ display: "none" }}
              multiple={false}
            />
          </div>

          <div className="flashcards-buttons">
            <button
              className="flashcards-button"
              onClick={handleUpload}
              disabled={!selectedFile}
            >
              <FiUpload style={{ marginRight: 4 }} />
              Upload PDF
            </button>
            {isUploading && <Spinner animation="border" role="status" />}
          </div>
        </div>

        <div className="attachments-section">
          {flashCards != null && !(flashCards.length === 0) && (
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ marginBottom: "1.5rem" }}
            >
              <div
                className="d-flex align-items-center"
                style={{ gap: "1rem" }}
              >
                <button
                  onClick={() => handleDownload()}
                  className="flashcards-button"
                  style={{ marginRight: "0.5rem" }}
                >
                  <FiDownload style={{ marginRight: 4 }} />
                  Export All to PDF
                </button>
                {isDownloading && <Spinner animation="border" role="status" />}
                <button
                  onClick={() => handlePlayGame(false)}
                  className="flashcards-button"
                >
                  <FaPlay style={{ marginRight: 4 }} />
                  Take Quiz
                </button>
              </div>

              <button
                className="chatbot-button"
                style={{
                  marginLeft: "1rem",
                  backgroundColor: "#fff",
                  color: "#800000",
                }}
                onClick={() => handleChatBot()}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#800000";
                  e.target.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "#800000";
                }}
              >
                <FaRobot
                  size={22}
                  style={{ marginRight: 6, color: "#800000" }}
                />
                Open ChatBot
              </button>
            </div>
          )}
          <h2 className="uploaded-docs">Uploaded Documents</h2>
          <hr style={{ margin: "0.5rem 0 1.5rem 0", borderColor: "#eee" }} />
          {attachments.length === 0 ? (
            <p style={{ color: "#888" }}>No documents uploaded yet.</p>
          ) : (
            <ul className="attachment-list">
              {attachments.map((attachment) => {
                const state = attachmentStates[attachment.id] || {
                  numFlashcards: 1,
                  isGenerating: false,
                  isGenerated: false,
                };

                return (
                  <li key={attachment.id} className="attachment-item">
                    <a
                      href={
                        attachment.fileUrl.startsWith("http")
                          ? attachment.fileUrl
                          : `${attachment.fileUrl}`
                      }
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
                        id={`flashcard-count-${attachment.id}`}
                        value={state.numFlashcards}
                        onChange={(e) =>
                          handleNumChange(attachment.id, e.target.value)
                        }
                        min="1"
                        max="5"
                        title="Number of flashcards"
                      />

                      <button
                        onClick={() => handleGenerate(attachment.id)}
                        className="flashcards-button"
                        disabled={state.isGenerating}
                        title="Generate Flashcards"
                      >
                        {state.isGenerating ? (
                          <>
                            Generating...{" "}
                            <Spinner animation="border" size="sm" />
                          </>
                        ) : (
                          <>
                            <FiZap style={{ marginRight: 4, color: "#fff" }} />
                            Generate Flashcards
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleDelete(attachment.id)}
                        className="icon-button"
                        title="Delete"
                      >
                        <FaTrash style={{ color: "#fff" }} />
                        <span className="button-tooltip">Delete</span>
                      </button>

                      {state.isGenerated && (
                        <>
                          <button
                            onClick={() => handlePdfDownload(attachment.id)}
                            className="icon-button"
                            title="Export to PDF"
                          >
                            <FiDownload size={18} style={{ color: "#fff" }} />
                            <span className="button-tooltip">
                              Export to PDF
                            </span>
                          </button>
                          <button
                            onClick={() => handlePlayGame(true, attachment.id)}
                            className="icon-button"
                            title="Take a quiz"
                          >
                            <FaPlay size={16} style={{ color: "#fff" }} />
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

export default CoursePage;
