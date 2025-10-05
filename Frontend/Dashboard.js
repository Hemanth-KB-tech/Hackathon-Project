import React, { useState } from "react";
import membersData from "./members.json";
import "./Dashboard.css";

function Dashboard() {
  const [role, setRole] = useState("patient");
  const [patientId, setPatientId] = useState("");
  const [nurseId, setNurseId] = useState("");
  const [member, setMember] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    let foundMember = membersData.find((m) => m.id === patientId);

    if (!foundMember) {
      setError("❌ Patient ID not found.");
      setMember(null);
      return;
    }

    if (role === "nurse" && nurseId.trim() === "") {
      setError("❌ Please enter Nurse ID.");
      setMember(null);
      return;
    }

    setMember(foundMember);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>🩺 Care Management Home</h1>
        <p className="subtitle">
          Welcome! Select your role and access member health data.
        </p>

        <div className="role-selection">
          <label>
            <input
              type="radio"
              value="patient"
              checked={role === "patient"}
              onChange={() => setRole("patient")}
            />
            Patient
          </label>
          <label>
            <input
              type="radio"
              value="nurse"
              checked={role === "nurse"}
              onChange={() => setRole("nurse")}
            />
            Nurse
          </label>
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          {role === "nurse" && (
            <div className="input-group">
              <label>Nurse ID:</label>
              <input
                type="text"
                value={nurseId}
                onChange={(e) => setNurseId(e.target.value)}
                placeholder="Enter Nurse ID"
                required
              />
            </div>
          )}

          <div className="input-group">
            <label>Patient ID:</label>
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter Patient ID"
              required
            />
          </div>

          <button type="submit" className="access-btn">
            Access Status
          </button>
        </form>

        {error && <p className="error-msg">{error}</p>}

        {member && (
          <div className="member-info-card">
            <h2>👤 {member.name} (ID: {member.id})</h2>
            <p>
              <strong>Age:</strong> {member.age} | <strong>Gender:</strong>{" "}
              {member.gender}
            </p>
            <p>
              <strong>Risk Score:</strong> {member.riskScore}/100 (
              {member.riskLevel})
            </p>

            <h3>🩺 Health Conditions:</h3>
            <ul>
              {member.conditions.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>

            <h3>📅 Upcoming Checkups:</h3>
            <ul>
              {member.admissions.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <h3>💡 Suggestions for Healthy Living:</h3>
            <ul>
              {member.interventions.map((i, index) => (
                <li key={index}>{i}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
