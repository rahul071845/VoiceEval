import { useAuth } from "../../context/AuthContext";
import {Navigate} from "react-router-dom";

export const ProtectedRoute = ({children}) => {
    const {isAuthenticated} = useAuth();
    if(!isAuthenticated) return <Navigate to="/login"/>
    return children;
}