import React, { useState, useEffect } from "react";
import membersData from "./members.json";
import "./Dashboard.css";

function Dashboard() {
  const [patientId, setPatientId] = useState("");
  const [professionalId, setProfessionalId] = useState("");
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Get user role from localStorage
  const userRole = localStorage.getItem("userRole") || "patient";
  const loggedInUsername = localStorage.getItem("loggedInUser") || "";

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
      // Validate based on role
      if ((userRole === "doctor" || userRole === "nurse") && !professionalId.trim()) {
        setError(`${userRole.charAt(0).toUpperCase() + userRole.slice(1)} ID is required.`);
        setIsLoading(false);
        return;
      }

      if (!patientId.trim()) {
        setError("Patient ID is required.");
        setIsLoading(false);
        return;
      }

      let foundMember = membersData.find((m) => m.id === patientId);

      if (!foundMember) {
        setError("Patient ID not found. Please check and try again.");
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

  const quickSearch = (patientId) => {
    setPatientId(patientId);
    setTimeout(() => {
      const foundMember = membersData.find((m) => m.id === patientId);
      if (foundMember) {
        setMember(foundMember);
        saveToHistory(foundMember);
      }
    }, 100);
  };

  // Render different forms based on user role
  const renderAccessForm = () => {
    switch(userRole) {
      case "patient":
        return (
          <div className="access-panel patient-view">
            <div className="panel-header">
              <div className="medical-icon">👤</div>
              <h2>Patient Portal</h2>
              <p>Enter your Patient ID to access your health records</p>
            </div>

            <form onSubmit={handleSubmit} className="access-form">
              <div className="form-group">
                <label>Your Patient ID</label>
                <input
                  type="text"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter your patient ID..."
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
                    View My Health Data
                  </>
                )}
              </button>
            </form>

            <div className="patient-help">
              <p>Don't know your Patient ID? Contact your healthcare provider.</p>
            </div>
          </div>
        );

      case "doctor":
        return (
          <div className="access-panel doctor-view">
            <div className="panel-header">
              <div className="medical-icon">🩺</div>
              <h2>Doctor Portal</h2>
              <p>Enter your Doctor ID and Patient ID to access medical records</p>
            </div>

            <form onSubmit={handleSubmit} className="access-form">
              <div className="form-group">
                <label>Doctor ID</label>
                <input
                  type="text"
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  placeholder="Enter your doctor ID..."
                  className="modern-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Patient ID</label>
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
                    Access Medical Records
                  </>
                )}
              </button>
            </form>
          </div>
        );

      case "nurse":
        return (
          <div className="access-panel nurse-view">
            <div className="panel-header">
              <div className="medical-icon">👩‍⚕️</div>
              <h2>Nurse Portal</h2>
              <p>Enter your Nurse ID and Patient ID to access patient records</p>
            </div>

            <form onSubmit={handleSubmit} className="access-form">
              <div className="form-group">
                <label>Nurse ID</label>
                <input
                  type="text"
                  value={professionalId}
                  onChange={(e) => setProfessionalId(e.target.value)}
                  placeholder="Enter your nurse ID..."
                  className="modern-input"
                  required
                />
              </div>

              <div className="form-group">
                <label>Patient ID</label>
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
                    Access Patient Records
                  </>
                )}
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>CareSync {userRole.charAt(0).toUpperCase() + userRole.slice(1)} Portal</h1>
          <p>
            {userRole === "patient" && "Access your personal health information"}
            {userRole === "doctor" && `Welcome, Dr. ${loggedInUsername} - Medical Professional Dashboard`}
            {userRole === "nurse" && `Welcome, Nurse ${loggedInUsername} - Patient Care Dashboard`}
          </p>
        </div>
        <div className="header-actions">
          <div className="user-info">
            <span className="user-avatar">
              {userRole === "patient" ? "👤" : userRole === "doctor" ? "🩺" : "👩‍⚕️"}
            </span>
            <span>
              {userRole === "doctor" ? `Dr. ${loggedInUsername}` : 
               userRole === "nurse" ? `Nurse ${loggedInUsername}` : loggedInUsername}
            </span>
            <span className="user-role">{userRole.charAt(0).toUpperCase() + userRole.slice(1)}</span>
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
        {/* Quick Stats Overview - Only show for doctor/nurse */}
        {(userRole === "doctor" || userRole === "nurse") && (
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
        )}

        <div className="main-content">
          {/* Left Panel - Search & History */}
          <div className="left-panel">
            {renderAccessForm()}

            {error && (
              <div className="error-message">
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Search History - Only show for doctor/nurse */}
            {(userRole === "doctor" || userRole === "nurse") && searchHistory.length > 0 && (
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

          {/* Right Panel - Patient Details or Welcome */}
          <div className="right-panel">
            {member ? (
              // Patient Profile Display (same for all roles)
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
                      <span className="patient-tag">{member.primaryDoctor}</span>
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
                  {["overview", "conditions", "appointments", "interventions", "details"].map(tab => (
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
                            <span className="condition-severity">Moderate</span>
                            <span className="condition-status">Active</span>
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
                            <div className="appointment-date">
                              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </div>
                            <div className="appointment-info">
                              <strong>{appointment}</strong>
                              <span>{member.primaryDoctor}</span>
                            </div>
                            <div className="appointment-status">Scheduled</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "interventions" && (
                    <div className="interventions-detail">
                      <h3>Care Interventions</h3>
                      <div className="interventions-list">
                        {member.interventions.map((intervention, index) => (
                          <div key={index} className="intervention-item">
                            <div className="intervention-number">{index + 1}</div>
                            <div className="intervention-text">{intervention}</div>
                            <div className="intervention-status">Active</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "details" && (
                    <div className="details-detail">
                      <h3>Patient Details</h3>
                      <div className="details-grid">
                        <div className="detail-item">
                          <label>Primary Doctor:</label>
                          <span>{member.primaryDoctor}</span>
                        </div>
                        <div className="detail-item">
                          <label>Insurance:</label>
                          <span>{member.insurance}</span>
                        </div>
                        <div className="detail-item">
                          <label>Last Visit:</label>
                          <span>{member.lastVisit}</span>
                        </div>
                        <div className="detail-item">
                          <label>Next Appointment:</label>
                          <span>{member.nextAppointment}</span>
                        </div>
                        <div className="detail-item">
                          <label>Emergency Contact:</label>
                          <span>{member.emergencyContact}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="welcome-panel">
                <div className="welcome-content">
                  <h2>
                    {userRole === "patient" && "Welcome to Your Patient Portal"}
                    {userRole === "doctor" && "Doctor Dashboard"}
                    {userRole === "nurse" && "Nurse Dashboard"}
                  </h2>
                  <p>
                    {userRole === "patient" && "Enter your Patient ID above to access your complete health profile, including conditions, appointments, and care recommendations."}
                    {userRole === "doctor" && "Enter your Doctor ID and Patient ID to access comprehensive medical records and treatment plans."}
                    {userRole === "nurse" && "Enter your Nurse ID and Patient ID to access patient records and care management tools."}
                  </p>
                  <div className="feature-list">
                    {userRole === "patient" && (
                      <>
                        <div className="feature-item">
                          <span className="feature-icon">📊</span>
                          <span>View Your Risk Score</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-icon">🩺</span>
                          <span>Check Health Conditions</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-icon">📅</span>
                          <span>See Upcoming Appointments</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-icon">💡</span>
                          <span>Get Care Recommendations</span>
                        </div>
                      </>
                    )}
                    {(userRole === "doctor" || userRole === "nurse") && (
                      <>
                        <div className="feature-item">
                          <span className="feature-icon">👥</span>
                          <span>Access Patient Records</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-icon">📊</span>
                          <span>Risk Analytics & Monitoring</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-icon">🩺</span>
                          <span>Medical Condition Management</span>
                        </div>
                        <div className="feature-item">
                          <span className="feature-icon">💊</span>
                          <span>Treatment Plan Oversight</span>
                        </div>
                      </>
                    )}
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
