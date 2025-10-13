import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Clear previous errors

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", data.user.username);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userEmail", data.user.email);
        
        navigate("/dashboard");
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error('Login error:', error);
      setError("Cannot connect to server. Please check if backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="medical-icon">🏥</div>
          <h1>CareSync</h1>
          <p className="tagline">Intelligent Patient Risk Stratification</p>
        </div>

        {/* Attractive Error Display */}
        {error && (
          <div className="login-error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-content">
              <div className="error-title">Login Failed</div>
              <div className="error-description">{error}</div>
            </div>
            <button 
              className="error-close"
              onClick={() => setError("")}
            >
              ×
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="modern-input"
            />
            <span className="input-icon">👤</span>
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="modern-input"
            />
            <span className="input-icon">🔒</span>
          </div>

          <button 
            type="submit" 
            className={`login-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              'Sign In'
            )}
          </button>

          <div className="auth-links">
            <button 
              type="button" 
              className="auth-link"
              onClick={() => navigate("/signup")}
            >
              Create Account
            </button>
            <span className="divider">•</span>
            <button type="button" className="auth-link">
              Forgot Password?
            </button>
          </div>
        </form>

        <div className="feature-highlights">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Risk Analytics</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🩺</span>
            <span>Patient Monitoring</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🔒</span>
            <span>Secure Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
