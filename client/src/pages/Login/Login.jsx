import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../../services/authService";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const loginMutation = useMutation({
        mutationFn: loginUser,
        onSuccess: (response) => {
            if (response.success && response.data) {
                const { user, token } = response.data;
                login(user, token);
                navigate("/dashboard");
            }
        }
    });
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email || !password) return;
        loginMutation.mutate({ email, password });
    }
    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>Welcome Back</h2>
                    <p>Log in to continue your interview prep</p>
                </div>
                {/* 3. Error Alert */}
                {loginMutation.isError && (
                    <div className="login-error">
                        {loginMutation.error?.response?.data?.message || 
                         loginMutation.error?.message || 
                         "Invalid credentials. Please try again."}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={loginMutation.isPending}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={loginMutation.isPending}
                        />
                    </div>
                    {/* 4. Dynamic Pending/Loading Button State */}
                    <button 
                        type="submit" 
                        className="login-btn"
                        disabled={loginMutation.isPending}
                    >
                        {loginMutation.isPending ? "Logging in..." : "Log In"}
                    </button>
                </form>
                <div className="login-footer">
                    <p>
                        New to VoiceEval?{" "}
                        <Link to="/register" className="signup-link">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;