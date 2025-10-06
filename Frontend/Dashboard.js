import React, { useState, useEffect } from "react";
import membersData from "./members.json";
import "./Dashboard.css";

function Dashboard() {
  const [role, setRole] = useState("patient");
  const [patientId, setPatientId] = useState("");
  const [nurseId, setNurseId] = useState("");
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeFilter, setTimeFilter] = useState("30d");

  // Load search history from localStorage
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(history);
  }, []);

  // Save to search history
  const saveToHistory = (patientData) => {
    const historyItem = {
      id: patientData.id,
      name: patientData.name,
      timestamp: new Date().toISOString(),
      riskScore: patientData.riskScore
    };
    
    const updatedHistory = [historyItem, ...searchHistory.filter(item => item.id !== patientData.id)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      let foundMember = membersData.find((m) => m.id === patientId);

      if (!foundMember) {
        setError("Patient ID not found. Please check and try again.");
        setMember(null);
      } else if (role === "nurse" && nurseId.trim() === "") {
        setError("Nurse ID is required for nurse access.");
        setMember(null);
      } else {
        setMember(foundMember);
        saveToHistory(foundMember);
      }
      setIsLoading(false);
    }, 800);
  };

  const getRiskColor = (score) => {
    if (score >= 80) return "#ef4444";
    if (score >= 60) return "#f59e0b";
    return "#10b981";
  };

  const getRiskLevel = (score) => {
    if (score >= 80) return "High Risk";
    if (score >= 60) return "Medium Risk";
    return "Low Risk";
  };

  const calculateAge = (dob) => {
    // If you add date of birth to your data
    return Math.floor((new Date() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const quickSearch = (patientId) => {
    setPatientId(patientId);
    // Auto-search after a brief delay
    setTimeout(() => {
      const foundMember = membersData.find((m) => m.id === patientId);
      if (foundMember) {
        setMember(foundMember);
        saveToHistory(foundMember);
      }
    }, 100);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>CareSync Analytics Dashboard</h1>
          <p>Comprehensive Patient Risk Management & Monitoring</p>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span className="user-avatar">👤</span>
            <span>{localStorage.getItem("loggedInUser")}</span>
            <span className="user-role">{localStorage.getItem("userRole") || "User"}</span>
          </div>
          <button 
            className="logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Quick Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-info">
              <h3>Total Patients</h3>
              <span className="stat-value">{membersData.length}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🩺</div>
            <div className="stat-info">
              <h3>High Risk</h3>
              <span className="stat-value">
                {membersData.filter(m => m.riskScore >= 80).length}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>Active Cases</h3>
              <span className="stat-value">
                {membersData.filter(m => m.admissions && m.admissions.length > 0).length}
              </span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>Avg Risk Score</h3>
              <span className="stat-value">
                {Math.round(membersData.reduce((acc, m) => acc + m.riskScore, 0) / membersData.length)}
              </span>
            </div>
          </div>
        </div>

        <div className="main-content">
          {/* Left Panel - Search & History */}
          <div className="left-panel">
            <div className="access-panel">
              <div className="panel-header">
                <h2>Patient Data Access</h2>
                <p>Select your role and enter required information</p>
              </div>

              <div className="role-selector">
                {["patient", "nurse", "doctor"].map((r) => (
                  <button
                    key={r}
                    className={`role-btn ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    <span className="role-icon">
                      {r === "patient" ? "👤" : r === "nurse" ? "🩺" : "⚕️"}
                    </span>
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="access-form">
                {role !== "patient" && (
                  <div className="form-group">
                    <label>{role.charAt(0).toUpperCase() + role.slice(1)} ID:</label>
                    <input
                      type="text"
                      value={nurseId}
                      onChange={(e) => setNurseId(e.target.value)}
                      placeholder={`Enter your ${role} ID...`}
                      className="modern-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Patient Identifier</label>
                  <input
                    type="text"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="Enter patient ID..."
                    className="modern-input"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className={`access-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="spinner"></div>
                  ) : (
                    <>
                      <span>🔍</span>
                      Retrieve Patient Data
                    </>
                  )}
                </button>
              </form>

              {error && (
                <div className="error-message">
                  <span>⚠️</span>
                  {error}
                </div>
              )}
            </div>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="history-panel">
                <h3>Recent Searches</h3>
                <div className="history-list">
                  {searchHistory.map((item, index) => (
                    <div 
                      key={index} 
                      className="history-item"
                      onClick={() => quickSearch(item.id)}
                    >
                      <div className="history-info">
                        <strong>{item.name}</strong>
                        <span>ID: {item.id}</span>
                      </div>
                      <div 
                        className="history-risk"
                        style={{ color: getRiskColor(item.riskScore) }}
                      >
                        {item.riskScore}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Patient Details */}
          <div className="right-panel">
            {member ? (
              <div className="patient-profile">
                <div className="profile-header">
                  <div className="patient-avatar">
                    {member.gender === "Male" ? "👨" : "👩"}
                  </div>
                  <div className="patient-info">
                    <h2>{member.name}</h2>
                    <p>ID: {member.id} • {member.age} years • {member.gender}</p>
                    <div className="patient-tags">
                      <span className="patient-tag">{getRiskLevel(member.riskScore)}</span>
                      <span className="patient-tag">{member.conditions.length} Conditions</span>
                    </div>
                  </div>
                  <div 
                    className="risk-badge"
                    style={{ backgroundColor: getRiskColor(member.riskScore) }}
                  >
                    Risk Score: {member.riskScore}/100
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                  {["overview", "conditions", "appointments", "interventions", "metrics"].map(tab => (
                    <button
                      key={tab}
                      className={`tab-btn ${activeTab === tab ? "active" : ""}`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                  {activeTab === "overview" && (
                    <div className="overview-grid">
                      <div className="health-card conditions">
                        <h3>🩺 Health Conditions</h3>
                        <div className="condition-list">
                          {member.conditions.map((condition, index) => (
                            <span key={index} className="condition-tag">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="health-card schedule">
                        <h3>📅 Upcoming Checkups</h3>
                        <ul className="schedule-list">
                          {member.admissions.map((admission, index) => (
                            <li key={index}>
                              <span className="schedule-icon">📌</span>
                              {admission}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="health-card interventions">
                        <h3>💡 Care Recommendations</h3>
                        <ul className="intervention-list">
                          {member.interventions.map((intervention, index) => (
                            <li key={index}>
                              <span className="intervention-icon">✅</span>
                              {intervention}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="health-card metrics">
                        <h3>📊 Health Metrics</h3>
                        <div className="metrics-grid">
                          <div className="metric">
                            <span className="metric-value">{member.riskScore}%</span>
                            <span className="metric-label">Risk Score</span>
                          </div>
                          <div className="metric">
                            <span className="metric-value">{member.conditions.length}</span>
                            <span className="metric-label">Conditions</span>
                          </div>
                          <div className="metric">
                            <span className="metric-value">{member.admissions.length}</span>
                            <span className="metric-label">Appointments</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "conditions" && (
                    <div className="conditions-detail">
                      <h3>Detailed Health Conditions</h3>
                      <div className="conditions-table">
                        {member.conditions.map((condition, index) => (
                          <div key={index} className="condition-row">
                            <span className="condition-name">{condition}</span>
                            <span className="condition-severity"> Moderate </span>
                            <span className="condition-status"> Active </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "appointments" && (
                    <div className="appointments-detail">
                      <h3>Appointment Schedule</h3>
                      <div className="appointments-list">
                        {member.admissions.map((appointment, index) => (
                          <div key={index} className="appointment-item">
                            <div className="appointment-date">Jun {15 + index}</div>
                            <div className="appointment-info">
                              <strong>{appointment}</strong>
                              <span>Dr. Smith • Cardiology Department</span>
                            </div>
                            <button className="appointment-action">Reschedule</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="welcome-panel">
                <div className="welcome-content">
                  <h2>Welcome to CareSync Dashboard</h2>
                  <p>Enter a patient ID to view detailed health information, risk assessments, and care recommendations.</p>
                  <div className="feature-list">
                    <div className="feature-item">
                      <span className="feature-icon">📊</span>
                      <span>Risk Stratification</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🩺</span>
                      <span>Condition Management</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📅</span>
                      <span>Appointment Tracking</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">💡</span>
                      <span>Care Recommendations</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
