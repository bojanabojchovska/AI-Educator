import React, {useEffect} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Authentication/LoginPage";
import RegisterPage from "./components/Authentication/RegisterPage";
import Admin from './components/Admin/Admin';
import HomePage from './components/home/HomePage';
import SemesterPage from "./components/Semester/SemesterPage";
import CourseReviews from "./components/Predmetnik/CourseReviews";
import CourseReviewPage from './components/Predmetnik/CourseReviewPage';
import FlashcardsPage from "./components/FlashcardsPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import SubjectRecommendation from "./components/Recommendations/SubjectRecommendation";
import FlashcardActions from "./components/FlashcardActions";
import CoursePage from './components/CoursePage/CoursePage';
import FlashCardGamePage from "./components/FlashCardGamePage";
import ChatBot from "./components/ChatBot/ChatBot";
import PrivateRoute from "./PrivateRoute";

function App() {
    const checkAuthCookie = () => {
        const isLoggedIn = document.cookie
            .split('; ')
            .find((row) => row.startsWith('jwt='));

        if (!isLoggedIn) {
            console.log('Auth cookie expired or missing. Clearing localStorage.');
            localStorage.clear();
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const interval = setInterval(checkAuthCookie, 5 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />

                    {/* private route logika za ako userot ne e logiran da go redirektira na login stranicata celo vreme */}
                    <Route
                        path="/admin"
                        element={<PrivateRoute element={<Admin />} />}
                    />
                    <Route
                        path="/semester-planning"
                        element={<PrivateRoute element={<SemesterPage />} />}
                    />
                    <Route
                        path="/subject-recommendation"
                        element={<PrivateRoute element={<SubjectRecommendation />} />}
                    />
                    <Route
                        path="/course-reviews"
                        element={<PrivateRoute element={<CourseReviews />} />}
                    />
                    <Route
                        path="/course/:courseId/reviews"
                        element={<PrivateRoute element={<CourseReviewPage />} />}
                    />
                    <Route
                        path="/flash-cards"
                        element={<PrivateRoute element={<FlashcardsPage />} />}
                    />
                    <Route
                        path="/flashcardactions"
                        element={<PrivateRoute element={<FlashcardActions />} />}
                    />
                    <Route
                        path="/course/:courseName"
                        element={<PrivateRoute element={<CoursePage />} />}
                    />
                    <Route
                        path="/flashcard-game/:courseId"
                        element={<PrivateRoute element={<FlashCardGamePage />} />}
                    />
                    <Route
                        path="/chatbot"
                        element={<PrivateRoute element={<ChatBot />} />}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;

