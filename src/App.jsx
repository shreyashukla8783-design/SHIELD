import React, { useState } from "react";
import RouteTracker from "./RouteTracker";
import Register from "./Register";
import Login from "./Login";
import "./App.css";

function App() {
  const [sendSOSHandler, setSendSOSHandler] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [active, setActive] = useState("Dashboard");
  const [scanning, setScanning] = useState(false);

  const menu = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Safe Route", icon: "🗺️" },
    { name: "Emergency", icon: "🚨" },
    { name: "AI Assistant", icon: "🤖" },
    { name: "Analytics", icon: "📊" },
    { name: "Settings", icon: "⚙️" },
  ];

  const alerts = [
    {
      name: "Route monitoring active",
      level: "SAFE",
      time: "Now",
    },
    {
      name: "Emergency contact connected",
      level: "SAFE",
      time: "Today",
    },
    {
      name: "Location services active",
      level: "INFO",
      time: "Today",
    },
  ];

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register
          onRegister={() => {
            setShowRegister(false);
            alert("Account created successfully. Please sign in.");
          }}
          onLogin={() => setShowRegister(false)}
        />
      );
    }

    return (
      <Login
        onLogin={() => {
          setIsLoggedIn(true);
        }}
        onRegister={() => {
          setShowRegister(true);
        }}
      />
    );
  }

  const handleScan = () => {
    setScanning(true);

    setTimeout(() => {
      setScanning(false);
      alert("SHIELD safety scan completed. Your system is secure.");
    }, 2000);
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="logo">🛡️ SHIELD</h2>

        <p className="side-label">SAFETY CENTER</p>

        {menu.map((item) => (
          <button
            key={item.name}
            className={`menu-item ${
              active === item.name ? "selected" : ""
            }`}
            onClick={() => setActive(item.name)}
          >
            <span>{item.icon}</span>
            {item.name}
          </button>
        ))}

        <div className="sidebar-bottom">
          <span className="online-dot"></span>
          Protection Active
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>{active}</h2>
            <p>Your personal safety and protection center.</p>
          </div>

          <div className="profile">
            <span className="profile-dot"></span>
            User
          </div>
        </header>

        {active === "Dashboard" && (
          <>
            <section className="welcome">
              <div>
                <span className="tag">PERSONAL SAFETY PLATFORM</span>

                <h1>
                  Stay Safe.
                  <br />
                  Stay Protected.
                </h1>

                <p>
                  SHIELD helps you monitor your journey, protect your
                  safe route and respond quickly during emergencies.
                </p>

                <button
                  className="scan-btn"
                  disabled={scanning}
                  onClick={handleScan}
                >
                  {scanning ? "Checking Safety..." : "Check My Safety →"}
                </button>
              </div>

              <div className="shield-icon">🛡️</div>
            </section>

            <h2 className="section-title">Safety Overview</h2>

            <section className="stats">
              <div className="stat-card">
                <span>🛡️ Protection Status</span>
                <h2>ACTIVE</h2>
                <small className="green">
                  SHIELD protection is enabled
                </small>
              </div>

              <div className="stat-card">
                <span>📍 Location Tracking</span>
                <h2>ON</h2>
                <small className="green">
                  Location monitoring available
                </small>
              </div>

              <div className="stat-card">
                <span>🚨 Emergency Contact</span>
                <h2>READY</h2>
                <small>
                  Emergency contact can be configured
                </small>
              </div>

              <div className="stat-card">
                <span>🗺️ Safe Route</span>
                <h2>MONITORING</h2>
                <small className="green">
                  Route protection available
                </small>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="panel">
                <h3>Safety Activity</h3>

                {alerts.map((alert, index) => (
                  <div className="alert" key={index}>
                    <div>
                      <strong>{alert.name}</strong>
                      <p>{alert.time}</p>
                    </div>

                    <span
                      className={`level ${
                        alert.level === "SAFE"
                          ? "low"
                          : "medium"
                      }`}
                    >
                      {alert.level}
                    </span>
                  </div>
                ))}
              </div>

              <div className="panel ai-panel">
                <div className="ai-circle">✦</div>

                <h3>SHIELD AI Assistant</h3>

                <p>
                  Get safety guidance, emergency instructions
                  and help understanding your SHIELD alerts.
                </p>

                <button
                  onClick={() => setActive("AI Assistant")}
                >
                  Open AI Assistant →
                </button>
              </div>
            </section>
          </>
        )}

        {active === "Safe Route" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="tag">LIVE PROTECTION</span>
              <h1>Safe Route</h1>
              <p>
                Monitor your current location and compare your
                journey with your saved safe route.
              </p>
            </div>

           <RouteTracker registerSOS={setSendSOSHandler} />
          </section>
        )}

        {active === "Emergency" && (
          <section className="page-section emergency-page">
            <div className="page-heading">
              <span className="tag">EMERGENCY CENTER</span>
              <h1>Emergency Protection</h1>
              <p>
                Configure your emergency contact and prepare
                SHIELD for emergency situations.
              </p>
            </div>

            <div className="emergency-card">
              <div className="emergency-icon">🚨</div>

              <h2>Emergency Contact</h2>

              <p>
                Your emergency contact will be used when
                SHIELD detects a serious safety situation.
              </p>

              <button
  className="sos-button"
  onClick={() => sendSOSHandler?.()}
>
  🚨 TEST SOS
</button>
            </div>
          

            <RouteTracker registerSOS={setSendSOSHandler} />        
          </section>
        )}

        {active === "AI Assistant" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="tag">SHIELD AI</span>
              <h1>AI Safety Assistant</h1>
              <p>
                Your personal assistant for safety guidance and
                emergency preparation.
              </p>
            </div>

            <div className="assistant-card">
              <div className="ai-circle">✦</div>
              <h2>Hello! I'm SHIELD AI.</h2>
              <p>
                I can help you understand your safety status,
                route alerts and emergency procedures.
              </p>

              <button
                onClick={() =>
                  alert(
                    "AI Assistant features will be connected here."
                  )
                }
              >
                Start Assistant →
              </button>
            </div>
          </section>
        )}

        {active === "Analytics" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="tag">SAFETY ANALYTICS</span>
              <h1>Your Safety Analytics</h1>
              <p>
                View your route activity and safety information.
              </p>
            </div>

            <div className="analytics-grid">
              <div className="stat-card">
                <span>Routes Monitored</span>
                <h2>0</h2>
                <small>Waiting for route activity</small>
              </div>

              <div className="stat-card">
                <span>Route Deviations</span>
                <h2>0</h2>
                <small className="green">
                  No deviations recorded
                </small>
              </div>

              <div className="stat-card">
                <span>Safety Checks</span>
                <h2>0</h2>
                <small>Activity will appear here</small>
              </div>
            </div>
          </section>
        )}

        {active === "Settings" && (
          <section className="page-section">
            <div className="page-heading">
              <span className="tag">ACCOUNT SETTINGS</span>
              <h1>Settings</h1>
              <p>
                Manage your SHIELD account and safety preferences.
              </p>
            </div>

            <div className="settings-card">
              <div className="setting-row">
                <div>
                  <h3>Location Services</h3>
                  <p>
                    Allow SHIELD to access your current location.
                  </p>
                </div>

                <span className="setting-status">ON</span>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Route Monitoring</h3>
                  <p>
                    Monitor your journey for unexpected deviations.
                  </p>
                </div>

                <span className="setting-status">ON</span>
              </div>

              <div className="setting-row">
                <div>
                  <h3>Emergency Protection</h3>
                  <p>
                    Configure emergency contacts and SOS options.
                  </p>
                </div>

                <span className="setting-status">READY</span>
              </div>
            </div>
          </section>
        )}

        <footer>
          SHIELD © 2026 | Personal Safety Platform
          <span>Prototype</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
