import RouteTracker from "./RouteTracker";
import Register from "./Register";
import Login from "./Login";
import React, { useState } from "react";
import "./App.css";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [scanning, setScanning] = useState(false);

  const menu = [
    "Dashboard",
    "Threat Detection",
    "Security Alerts",
    "AI Assistant",
    "Analytics",
    "Settings",
  ];

  const alerts = [
    { name: "Suspicious Login Attempt", level: "HIGH", time: "2 min ago" },
    { name: "Unusual Network Activity", level: "MEDIUM", time: "15 min ago" },
    { name: "Firewall Rule Updated", level: "LOW", time: "1 hour ago" },
  ];
  if (!isLoggedIn) {
  return (
    <Login
      onLogin={(email) => {
        setIsLoggedIn(true);
      }}
      onRegister={() => {
        alert("Registration feature coming next!");
      }}
    />
  );
}

  return (
    <div className="app">
      <RouteTracker />
      <aside className="sidebar">
        <h2 className="logo">🛡 SHIELD</h2>
        <p className="side-label">MAIN MENU</p>

        {menu.map((item) => (
          <button
            key={item}
            className={`menu-item ${active === item ? "selected" : ""}`}
            onClick={() => setActive(item)}
          >
            {item}
          </button>
        ))}

        <div className="sidebar-bottom">
          <span className="online-dot"></span>
          System Online
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>{active}</h2>
            <p>Welcome to your intelligent security center.</p>
          </div>
          <div className="profile">Admin</div>
        </header>

        <section className="welcome">
          <div>
            <span className="tag">AI SECURITY PLATFORM</span>
            <h1>Stay Protected.<br />Stay Ahead.</h1>
            <p>
              Monitor threats, detect suspicious activity
              and manage your security with SHIELD AI.
            </p>
            <button
              className="scan-btn"
              disabled={scanning}
              onClick={() => {
                setScanning(true);
                setTimeout(() => setScanning(false), 2000);
              }}
            >
              {scanning ? "Scanning..." : "Run Security Scan →"}
            </button>
          </div>
          <div className="shield-icon">🛡️</div>
        </section>

        <h2 className="section-title">Security Overview</h2>

        <section className="stats">
          <div className="stat-card">
            <span>Threats Detected</span>
            <h2>24</h2>
            <small className="red">↑ 4 this week</small>
          </div>
          <div className="stat-card">
            <span>System Protection</span>
            <h2>98.5%</h2>
            <small className="green">Protection status: Demo</small>
          </div>
          <div className="stat-card">
            <span>Active Devices</span>
            <h2>12</h2>
            <small>Demo device count</small>
          </div>
          <div className="stat-card">
            <span>Security Score</span>
            <h2>92/100</h2>
            <small className="green">Demo score</small>
          </div>
        </section>

        <section className="bottom-grid">
          <div className="panel">
            <h3>Recent Security Alerts</h3>
            {alerts.map((alert, index) => (
              <div className="alert" key={index}>
                <div>
                  <strong>{alert.name}</strong>
                  <p>{alert.time}</p>
                </div>
                <span className={`level ${alert.level.toLowerCase()}`}>
                  {alert.level}
                </span>
              </div>
            ))}
          </div>

          <div className="panel ai-panel">
            <div className="ai-circle">✦</div>
            <h3>SHIELD AI Assistant</h3>
            <p>
              Your AI security assistant is ready to help
              you understand security risks.
            </p>
            <button onClick={() => setActive("AI Assistant")}>
              Open AI Assistant →
            </button>
          </div>
        </section>

        <footer>
          SHIELD © 2026 | AI-Powered Security Platform
          <span>Frontend Demo</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
