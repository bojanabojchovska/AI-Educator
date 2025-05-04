import React, { useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import CustomNavbar from './CustomNavbar';
import './FlashcardsPage.css';
import axios from 'axios'; // ⬅️ ADD axios!

const FlashcardsPage = () => {
  const [file, setFile] = useState(null);
  const [numFlashcards, setNumFlashcards] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false); // ⬅️ NEW state!

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setIsGenerated(false); // ⬅️ Reset if new file is uploaded
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
    
    // Dynamically get the course ID (replace with actual logic)
    const courseId = 1; // Replace this with the actual course ID from your app's state or context
    formData.append("course_id", courseId);
  
    try {
      await axios.post('http://localhost:8080/api/flashcards/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setIsGenerated(true);
      alert("Flashcards generated!");
    } catch (error) {
      console.error("Error generating flashcards:", error);
      alert(error.response?.data?.message || "Failed to generate flashcards. Please try again!");
    }
  };
  

  const handleDownload = () => {
    window.open('http://localhost:8080/api/flashcards/export/1', '_blank'); // ⬅️ Hardcoded course id
  };

  const handlePlayGame = () => {
    console.log("Playing flashcards game...");
  };

  return (
    <>
      <CustomNavbar pageTitle="Flashcards" />

      <div className="flashcards-container">
        <h1 className="flashcards-title">Generate your flash cards here!</h1>
        <p className="flashcards-subtitle">
          Please upload your notes or learning material as a PDF and select the number of flashcards you'd like to create
        </p>

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
                style={{ display: 'none' }}
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
            Generate
          </button>

          {isGenerated && (
            <>
              <button className="flashcards-button" onClick={handleDownload}>
                Download
              </button>
              <button className="flashcards-button" onClick={handlePlayGame}>
                Play game
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FlashcardsPage;
