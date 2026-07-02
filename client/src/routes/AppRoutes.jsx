import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import Interview from "../pages/Interview/Interview";
import Results from "../pages/Results/Results";
import NotFound from "../pages/NotFound/NotFound";
import Landing from "../pages/Landing/Landing";
import { ProtectedRoute } from "../components/common/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview/:sessionId" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
            <Route path="/results/:sessionId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;