import React, {useState, useEffect, use} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import CustomNavbar from "../app-custom/CustomNavbar";
import {
  getCourseAttachments,
  getCourses,
  generateFlashCards,
  getFlashCardsByCourseAndUser,
  uploadCourseAttachment, exportFlashCards, deleteAttachment
} from "../../services/api";
import "./CoursePage.css";
import {Spinner} from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [attachments, setAttachments] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);

  const [numFlashcards, setNumFlashcards] = useState(1);
  const [isGeneratedClicked, setIsGeneratedClicked] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
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

        if(course){
          const courseAttachments = await getCourseAttachments(course.id);
          setAttachments(courseAttachments);

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
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setSelectedFile(selectedFile);
    } else {
      alert('Please upload a valid PDF file.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    setIsUploading(true);
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('courseId', courseDetails.id);

    try {
      const data = await uploadCourseAttachment(formData);
      setNotification("File " + data.originalFileName + " uploaded successfully!")
      setAttachments([...attachments, data]);
      setSelectedFile(null);
      setIsUploading(false);
    } catch (error) {
      setError(error);
      setIsUploading(false);
    }
  };

  const handleNumChange = (event) => {
    setNumFlashcards(event.target.value);
  };

  const handleGenerate = async (attachmentId) => {
    setIsGeneratedClicked(true);

    try {
      const newFlashCards = await generateFlashCards(attachmentId, numFlashcards);
      setFlashCards(flashCards => [...flashCards, ...newFlashCards]);

      setIsGenerated(true);
      alert("Flashcards generated!");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError(error);
      alert(
        error.response?.data?.message ||
          "Failed to generate flashcards. Please try again!"
      );
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const url = await exportFlashCards(courseDetails.id);
      setNotification("Successfully exported flashcards to pdf!");
      setIsDownloading(false);

      const link = document.createElement('a');
      link.href = url;
      link.click();
    } catch (error) {
      setIsDownloading(false);
      console.error("Error downloading flashcards:", error);
      setError(error);
      alert(
          error.response?.data?.message ||
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
    return <div>Loading... <Spinner animation="border" role="status" /></div>;
  }

 const handleDelete = async (attachmentId) => {
   try {
     await deleteAttachment(attachmentId);
     setAttachments(prev =>
         prev.filter(attachment => attachment.id !== attachmentId)
     );
     setFlashCards(prev =>
         prev.filter(fc => fc.attachment?.id !== attachmentId)
     );

     setNotification("Attachment deleted successfully!");
   }catch(error){
     console.error("Error deleting attachment: " + error);
     setError(error);
   }
 }

  return (
      <>
        <CustomNavbar/>

        <div className="course-details-section">
          <h1 className="course-details-title">{courseName}</h1>
          <p className="course-details-description">{courseDetails.description}</p>
        </div>

        <div className="flashcards-container">
          <h1 className="flashcards-title">Upload Your Course PDF</h1>
          <p className="flashcards-subtitle">
            Upload a PDF related to your course. You can generate flashcards, take a quiz, download them,
            and preview them anytime.
          </p>

          <div className="upload-box">
            <label htmlFor="file-upload" className="custom-upload-label">
              <FiUpload size={20}/>
              {selectedFile ? selectedFile.name : 'Choose PDF File'}
            </label>
            <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleChooseFile}
                style={{display: 'none'}}
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
            {isUploading &&  <Spinner animation="border" role="status"/>}
          </div>
        </div>

        <div className="attachments-section">
          {flashCards != null && !(flashCards.length === 0) && (
              <div>
                <button
                    onClick={() => handleDownload()}
                    className="flashcards-button"
                >
                  Export to PDF
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
                {attachments.map((attachment) => (
                    <li key={attachment.id} className="attachment-item">
                      <span>{attachment.originalFileName}</span>
                      <div>
                        <input
                            type="number"
                            id={`flashcard-count-${attachment.id}`}
                            value={numFlashcards}
                            onChange={(e) => setNumFlashcards(e.target.value)}
                            min="1"
                            max="5"
                            disabled={isGenerated}
                        />
                        <button
                            onClick={() => handleGenerate(attachment.id)}
                            className="flashcards-button"
                            disabled={isGenerated}
                        >
                          Generate Flashcards
                        </button>
                        <button
                            onClick={() => handleDelete(attachment.id)}
                            className="flashcards-button"
                        >
                          <FaTrash style={{ cursor: 'pointer' }}/>
                        </button>

                        {isGeneratedClicked && !isGenerated && (
                            <Spinner animation="border" role="status"/>
                        )}
                      </div>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </>
  );
};

export default CoursePage;
