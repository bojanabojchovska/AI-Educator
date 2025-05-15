import React, { useState, useEffect, use } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
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

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
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

          // Initialize state for each attachment
          const initialStates = {};
          courseAttachments.forEach((attachment) => {
            const hasFlashcards = flashCards.some(
              (fc) => fc.attachment?.id === attachment.id
            );
            initialStates[attachment.id] = {
              numFlashcards: 1,
              isGenerating: false,
              isGenerated: hasFlashcards,
            };
          });
          setAttachmentStates(initialStates);

          const flashCards = await getFlashCardsByCourseAndUser(course.id);
          setFlashCards(flashCards);
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

      // Open in new tab
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

  const handlePlayGame = () => {
    navigate(`/flashcard-game/${courseDetails.id}`);
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
        prev.filter((fc) => fc.attachment?.id !== attachmentId)
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
          Upload a PDF related to your course. You can generate flashcards, take
          a quiz, download them, and preview them anytime.
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
            Upload PDF
          </button>
          {isUploading && <Spinner animation="border" role="status" />}
        </div>
      </div>

      <div className="attachments-section">
        {flashCards != null && !(flashCards.length === 0) && (
          <div>
            <button
              onClick={() => handleDownload()}
              className="flashcards-button"
              style={{ marginRight: "1rem" }}
            >
              Export All to PDF
            </button>
            {isDownloading && <Spinner animation="border" role="status" />}
            <button
              onClick={() => handlePlayGame()}
              className="flashcards-button"
            >
              Take Quiz
            </button>
          </div>
        )}
        <h2>Uploaded Documents</h2>
        {attachments.length === 0 ? (
          <p>No documents uploaded yet.</p>
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
                  <span>{attachment.originalFileName}</span>
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
                      disabled={state.isGenerated}
                    />

                    <button
                      onClick={() => handleGenerate(attachment.id)}
                      className="flashcards-button"
                      disabled={state.isGenerated || state.isGenerating}
                    >
                      {state.isGenerating ? (
                        <>
                          Generating... <Spinner animation="border" size="sm" />
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
                      <FaTrash />
                    </button>

                    {state.isGenerated && (
                      <>
                        <button
                          onClick={() => handlePdfDownload(attachment.id)}
                          className="icon-button"
                          title="Export to PDF"
                        >
                          <FiDownload size={18} />
                          <span className="button-tooltip">Export to PDF</span>
                        </button>
                        <button
                          onClick={() => handlePlayGame()}
                          className="icon-button"
                          title="Take a quiz"
                        >
                          <FaPlay size={16} />
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
    </>
  );
};

export default CoursePage;
