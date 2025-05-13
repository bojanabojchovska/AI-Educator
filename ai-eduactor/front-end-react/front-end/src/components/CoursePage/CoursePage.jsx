import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import CustomNavbar from "../app-custom/CustomNavbar";
import {getCourseAttachments, getCourses, uploadAttachment} from "../../services/api";
import axios from "axios";
import "./CoursePage.css";

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [numFlashcards, setNumFlashcards] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
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
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseName]);

  const handleChooseFile = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    } else {
      alert('Please upload a valid PDF file.');
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('courseId', courseDetails.id);


    try {
      const data = await uploadAttachment(formData);
      setNotification("File " + data.originalFileName + " uploaded successfully!")
    } catch (error) {
      setError(error);
    }
  };

  const handleNumChange = (event) => {
    setNumFlashcards(event.target.value);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_flashcards", numFlashcards);
    formData.append("course_id", courseDetails.id);

    try {
      await axios.post(
        "http://localhost:8080/api/flashcards/generate",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setIsGenerated(true);
      alert("Flashcards generated!");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(
        error.response?.data?.message ||
          "Failed to generate flashcards. Please try again!"
      );
    }
  };

  const handleDownload = () => {
    window.open(
      `http://localhost:8080/api/flashcards/export/${courseDetails.id}`,
      "_blank"
    );
  };

  const handlePlayGame = () => {
    navigate(`/flashcard-game/${courseDetails.id}`);
  };

  const handlePlayDemo = () => {
    navigate(`/flashcards/game/${courseDetails.id}`);
  };

  if (!courseDetails) {
    return <div>Loading...</div>;
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
          </div>
        </div>

        <div className="attachments-section">
          <h2>Uploaded Documents</h2>
          {attachments.length === 0 ? (
              <p>No documents uploaded yet.</p>
          ) : (
              <ul className="attachment-list">
                {attachments.map((attachment) => (
                    <li key={attachment.id} className="attachment-item">
                      <span>{attachment.fileName}</span>
                      <button
                          onClick={() => handleGenerate(attachment.id)}
                          className="flashcards-button"
                      >
                        Generate Flashcards
                      </button>
                      <button
                          onClick={() => handleDownload(attachment.id)}
                          className="flashcards-button"
                      >
                        Export to PDF
                      </button>
                      <button
                          onClick={() => handlePlayGame(attachment.id)}
                          className="flashcards-button"
                      >
                        Take Quiz
                      </button>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </>
  );
};

export default CoursePage;
