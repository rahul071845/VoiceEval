import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./Register.css";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: registerUser,
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
        if (!name || !email || !password) return;
        registerMutation.mutate({ name, email, password });
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <h2>Create Account</h2>
                    <p>Sign up to start simulating technical mock interviews</p>
                </div>

                {registerMutation.isError && (
                    <div className="register-error">
                        {registerMutation.error?.response?.data?.message ||
                            registerMutation.error?.message ||
                            "Registration failed. Please try again."}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            disabled={registerMutation.isPending}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={registerMutation.isPending}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Min 6 characters..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            disabled={registerMutation.isPending}
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                        disabled={registerMutation.isPending}
                    >
                        {registerMutation.isPending ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="register-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login" className="login-link">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;