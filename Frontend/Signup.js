import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

// Backend API URL
const API_BASE_URL = "http://localhost:5000/api";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient"
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (data.success) {
        // Store user session
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", formData.username);
        localStorage.setItem("userRole", formData.role);
        localStorage.setItem("userEmail", formData.email);

        // Navigate directly to dashboard without alert
        navigate("/dashboard");
      } else {
        setErrors({ general: data.error });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: "Cannot connect to server. Make sure backend is running on localhost:5000" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <div className="medical-icon">🏥</div>
          <h1>Join CareSync</h1>
          <p className="subtitle">Create your account - Data saved to JSON file</p>
        </div>

        {errors.general && (
          <div className="error-message" style={{ 
            background: 'rgba(254, 242, 242, 0.9)',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            fontWeight: '500'
          }}>
            ⚠️ {errors.general}
          </div>
        )}

        <form onSubmit={handleSignup} className="signup-form">
          <div className="form-row">
            <div className="form-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
                className={`modern-input ${errors.username ? 'error' : ''}`}
              />
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                className={`modern-input ${errors.email ? 'error' : ''}`}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className={`modern-input ${errors.password ? 'error' : ''}`}
              />
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`modern-input ${errors.confirmPassword ? 'error' : ''}`}
              />
              {errors.confirmPassword && (
                <span className="error-text">{errors.confirmPassword}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>I am a...</label>
            <div className="role-options">
              {[
                { value: "patient", label: "Patient", icon: "👤" },
                { value: "nurse", label: "Nurse", icon: "🩺" },
                { value: "doctor", label: "Doctor", icon: "⚕️" }
              ].map((roleOption) => (
                <label key={roleOption.value} className="role-option">
                  <input
                    type="radio"
                    name="role"
                    value={roleOption.value}
                    checked={formData.role === roleOption.value}
                    onChange={handleChange}
                  />
                  <div className="role-card">
                    <span className="role-icon">{roleOption.icon}</span>
                    <span className="role-label">{roleOption.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="terms-agreement">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>

          <button 
            type="submit" 
            className={`signup-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                :oadi...
              </>
            ) : (
              <>
                <span>🚀</span>
                Create Account 
              </>
            )}
          </button>

          <div className="auth-links">
            <span>Already have an account?</span>
            <button 
              type="button" 
              className="auth-link"
              onClick={() => navigate("/")}
            >
              Sign In
            </button>
          </div>
        </form>

        
      </div>
    </div>
  );
}

export default Signup;
