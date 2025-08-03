import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Home from "./Pages/Home";
import Notfound from "./Pages/Notfound";
import FeedbackDetails from "./components/comment-details/CommentDetails";
import FeedbackForm from "./components/Feedback-form/FeedbackForm";
import Roadmap from "./components/Roadmap/Roadmap";
import Auth from "./components/Auth/Auth";
import TestPage from "./components/Testpage/TestPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Auth />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Home />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/feedback/:id" element={<FeedbackDetails />} />
          <Route path="/feedback/create" element={<FeedbackForm />} />
          <Route path="/feedback/edit/:id" element={<FeedbackForm />} />
          <Route path="/roadmap" element={<Roadmap />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </Router>
  );
};
export default App;
