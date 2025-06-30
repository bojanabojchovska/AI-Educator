import React from "react";
import { HashRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./components/Authentication/LoginPage";
import RegisterPage from "./components/Authentication/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import HomePage from './components/HomePage/HomePage';
import Admin from './components/Admin/Admin';
import SemesterPage from "./components/Semester/SemesterPage";
import CoursePage from './components/CoursePage/CoursePage';
import CourseHub from "./components/Predmetnik/CourseHub";
import CourseReviewPage from './components/Predmetnik/CourseReviewPage';
import FlashCardGamePage from "./components/FlashCardQuiz/FlashCardGamePage";
import FlashcardCourseSelector from "./components/FlashCardGeneratorForm/FlashcardCourseSelector";
import SubjectRecommendation from "./components/Recommendations/SubjectRecommendation";
import ChatBot from "./components/ChatBot/ChatBot";
import 'bootstrap/dist/css/bootstrap.min.css';

function AuthChecker() {
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthCookie = () => {
            try {
                const isLoggedIn = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('jwt='));

                if (!isLoggedIn) {
                    console.log('Auth cookie expired or missing. Clearing localStorage.');
                    localStorage.clear();
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                navigate('/login');
            }
        };

        const interval = setInterval(checkAuthCookie, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [navigate]);

    return null;
}

function App() {
    return (
        <Router>
            <AuthChecker />
            <div className="App">
                <Routes>
                    <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<PrivateRoute element={<Admin />} />} />
                    <Route path="/semester-planning" element={<PrivateRoute element={<SemesterPage />} />} />
                    <Route path="/subject-recommendation" element={<PrivateRoute element={<SubjectRecommendation />} />} />
                    <Route path="/course-reviews" element={<PrivateRoute element={<CourseHub />} />} />
                    <Route path="/course/:courseId/reviews" element={<PrivateRoute element={<CourseReviewPage />} />} />
                    <Route path="/flashcards" element={<PrivateRoute element={<FlashcardCourseSelector />} />} />
                    <Route path="/course/:courseName" element={<PrivateRoute element={<CoursePage />} />} />
                    <Route path="/flashcard-game/:courseId" element={<PrivateRoute element={<FlashCardGamePage />} />} />
                    <Route path="/chatbot" element={<PrivateRoute element={<ChatBot />} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
