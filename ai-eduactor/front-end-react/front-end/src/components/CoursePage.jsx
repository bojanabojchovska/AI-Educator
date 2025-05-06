import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import CustomNavbar from "./CustomNavbar";
import { getCourses } from "../repository/api";
import axios from "axios";
import "./FlashcardsPage.css";

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [numFlashcards, setNumFlashcards] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courses = await getCourses();
        const course = courses.find((c) => c.title === courseName);
        setCourseDetails(course);
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseName]);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsGenerated(false);
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
      <CustomNavbar />
      <div className="flashcards-container">
        <h1 className="flashcards-title">{courseDetails.title}</h1>
        <p className="flashcards-subtitle">{courseDetails.description}</p>

        <div className="flashcards-buttons">
          <button className="flashcards-button" onClick={handlePlayDemo}>
            Try Flashcards Game
          </button>
          <br />
        </div>

        <div className="flashcards-upload-range">
          <div className="upload-section">
            <label>Upload PDF</label>
            <div className="upload-icon">
              <label htmlFor="file-upload">
                <FiUpload size={24} />
              </label>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          <div className="range-section">
            <label>Select number of flashcards</label>
            <div className="range-control">
              <span>0</span>
              <input
                type="range"
                min="0"
                max="100"
                value={numFlashcards}
                onChange={handleNumChange}
              />
              <span>100</span>
            </div>
          </div>
        </div>

        <div className="flashcards-buttons">
          <button className="flashcards-button" onClick={handleGenerate}>
            Generate Flashcards
          </button>
          {isGenerated && (
            <>
              <button className="flashcards-button" onClick={handleDownload}>
                Download
              </button>
              <button className="flashcards-button" onClick={handlePlayGame}>
                Play Game
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CoursePage;
