import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.username === username && u.password === password
      );

      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", username);
        navigate("/dashboard");
      } else {
        alert("❌ Invalid credentials. Please try again or sign up.");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-section">
          <div className="medical-icon">🏥</div>
          <h1>CareSync</h1>
          <p className="tagline">Intelligent Patient Risk Stratification</p>
        </div>

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
