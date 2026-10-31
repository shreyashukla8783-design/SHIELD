import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapUpdater({ location }) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView(
        [location.latitude, location.longitude],
        16
      );
    }
  }, [location, map]);

  return null;
}

// Calculate distance between two GPS points in meters
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c =
    2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Find distance from current location to nearest safe-route point
function getNearestDistance(location, safeRoute) {
  if (!location || safeRoute.length === 0) {
    return null;
  }

  let minimumDistance = Infinity;

  safeRoute.forEach((point) => {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      point[0],
      point[1]
    );

    if (distance < minimumDistance) {
      minimumDistance = distance;
    }
  });

  return minimumDistance;
}

function RouteTracker() {
  const [tracking, setTracking] = useState(false);
    const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  const [emergencyContact, setEmergencyContact] = useState(() => {
    const savedContact = localStorage.getItem(
      "shieldEmergencyContact"
    );

    return savedContact
      ? JSON.parse(savedContact)
      : null;
  });
  const [location, setLocation] = useState(null);
  const [route, setRoute] = useState([]);

  const [safeRoute, setSafeRoute] = useState(() => {
    const savedRoute = localStorage.getItem(
      "shieldSafeRoute"
    );

    return savedRoute
      ? JSON.parse(savedRoute)
      : [];
  });

  const [error, setError] = useState("");
  const [deviationDistance, setDeviationDistance] =
    useState(null);

  const [countdown, setCountdown] =
    useState(120);

  const [warningActive, setWarningActive] =
    useState(false);

  const [sosReady, setSosReady] =
    useState(false);

  // =========================
  // AUTOMATIC GPS TRACKING
  // =========================

  useEffect(() => {
    if (!navigator.geolocation) {
      setError(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setTracking(true);

    const watchId =
      navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude:
              position.coords.latitude,

            longitude:
              position.coords.longitude,

            speed:
              position.coords.speed,

            time:
              new Date().toLocaleTimeString(),
          };

          setLocation(newLocation);

          setRoute((previousRoute) => [
            ...previousRoute,
            [
              newLocation.latitude,
              newLocation.longitude,
            ],
          ]);

          // Check deviation from Safe Route
          if (safeRoute.length > 0) {
            const distance =
              getNearestDistance(
                newLocation,
                safeRoute
              );

            setDeviationDistance(distance);
          }

          setError("");
          setTracking(true);
        },

        (err) => {
          console.log(
            "Location error:",
            err
          );

          if (err.code === 1) {
            setError(
              "Location permission denied."
            );
          } else if (err.code === 2) {
            setError(
              "Location is unavailable."
            );
          } else if (err.code === 3) {
            setError(
              "Location request timed out."
            );
          } else {
            setError(
              "Unable to get your location."
            );
          }
        },

        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 10000,
        }
      );

    return () => {
      navigator.geolocation.clearWatch(
        watchId
      );
    };
  }, [safeRoute]);

  // =========================
  // CURRENT POSITION
  // =========================

  const currentPosition = location
    ? [
        location.latitude,
        location.longitude,
      ]
    : [26.237782, 81.248563];

  // =========================
  // DEVIATION CHECK
  // =========================

  const isDeviated =
    safeRoute.length > 0 &&
    deviationDistance !== null &&
    deviationDistance > 100;

  // =========================
  // SOS COUNTDOWN
  // =========================

  useEffect(() => {
    let timer;

    if (isDeviated && !sosReady) {
      setWarningActive(true);
      setCountdown(120);

      timer = setInterval(() => {
        setCountdown((previous) => {
          if (previous <= 1) {
            clearInterval(timer);

            setWarningActive(false);
            setSosReady(true);

            return 0;
          }

          return previous - 1;
        });
      }, 1000);
    }

    if (!isDeviated) {
      setWarningActive(false);
      setCountdown(120);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isDeviated, sosReady]);

  // =========================
  // SHIELD MAP ICON
  // =========================

  const shieldIcon = L.divIcon({
    className:
      "shield-location-marker",

    html: "🛡️",

    iconSize: [35, 35],

    iconAnchor: [17, 17],
  });
    // =========================
  // SAVE EMERGENCY CONTACT
  // =========================

  const saveEmergencyContact = () => {
    if (!emergencyName.trim() || !emergencyPhone.trim()) {
      alert("Please enter both name and phone number.");
      return;
    }

    const contact = {
      name: emergencyName.trim(),
      phone: emergencyPhone.trim(),
    };

    localStorage.setItem(
      "shieldEmergencyContact",
      JSON.stringify(contact)
    );

    setEmergencyContact(contact);

    setEmergencyName("");
    setEmergencyPhone("");

    alert("✅ Emergency Contact saved!");
  };

  // =========================
  // DELETE EMERGENCY CONTACT
  // =========================

  const deleteEmergencyContact = () => {
      // =========================
  // SEND SOS MESSAGE
  // =========================

  const sendSOS = () => {
    if (!emergencyContact) {
      alert("⚠️ Please add an emergency contact first.");
      return;
    }

    if (!location) {
      alert("⚠️ Current location is not available.");
      return;
    }

    const latitude = location.latitude;
    const longitude = location.longitude;

    const locationLink =
      `https://www.google.com/maps?q=${latitude},${longitude}`;

    const message =
      `🚨 SHIELD EMERGENCY ALERT 🚨\n\n` +
      `I may need help. Please check my location.\n\n` +
      `📍 My current location:\n` +
      `${locationLink}\n\n` +
      `Please contact me immediately.`;

    const smsUrl =
      `sms:${emergencyContact.phone}?body=${encodeURIComponent(message)}`;

    window.location.href = smsUrl;
  };
    localStorage.removeItem(
      "shieldEmergencyContact"
    );

    setEmergencyContact(null);

    alert("Emergency Contact removed.");
  };

  // =========================
  // SAVE SAFE ROUTE
  // =========================

  const saveSafeRoute = () => {
    if (route.length < 2) {
      alert(
        "Please move along your route first so SHIELD can record enough points."
      );

      return;
    }

    localStorage.setItem(
      "shieldSafeRoute",
      JSON.stringify(route)
    );

    setSafeRoute(route);

    alert(
      "✅ Your current route has been saved as the Safe Route!"
    );
  };

  // =========================
  // CLEAR SAFE ROUTE
  // =========================

  const clearSafeRoute = () => {
    localStorage.removeItem(
      "shieldSafeRoute"
    );

    setSafeRoute([]);

    setDeviationDistance(null);

    alert(
      "Safe Route has been removed."
    );
  };

  // =========================
  // MAIN UI
  // =========================

  return (
    <div className="route-tracker">

      <h2>
        🛡️ Automatic Route Tracking
      </h2>

      {/* TRACKING STATUS */}

      {tracking ? (
        <p>
          🟢 SHIELD is automatically
          tracking your route
        </p>
      ) : (
        <p>
          🔴 Tracking is not active
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p>
          ⚠️ {error}
        </p>
      )}

      {/* SAFE ROUTE STATUS */}

      {safeRoute.length === 0 ? (
        <p>
          🟡 No Safe Route has been set
        </p>
      ) : (
        <p>
          🟢 Safe Route is active
        </p>
      )}

      {/* =========================
          DEVIATION WARNING
          ========================= */}

      {isDeviated &&
        warningActive && (
          <div
            style={{
              background: "#7f1d1d",
              color: "white",
              padding: "15px",
              margin: "15px 0",
              borderRadius: "10px",
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            <h2>
              🚨 ROUTE DEVIATION DETECTED!
            </h2>

            <p>
              You are approximately{" "}
              {Math.round(
                deviationDistance
              )}{" "}
              meters away from your
              Safe Route.
            </p>

            <h1>
              {Math.floor(
                countdown / 60
              )}
              :
              {String(
                countdown % 60
              ).padStart(2, "0")}
            </h1>

            <p>
              Are you okay?
            </p>

            <button
              onClick={() => {
                setWarningActive(false);
                setSosReady(false);
                setCountdown(120);
              }}
              style={{
                padding: "12px 25px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "16px",
              }}
            >
              ✅ I'm Safe
            </button>
          </div>
        )}

            {/* =========================
          SOS ESCALATION
          ========================= */}

      {sosReady && (
        <div
          style={{
            background: "#991b1b",
            color: "white",
            padding: "20px",
            margin: "15px 0",
            borderRadius: "12px",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          <h2>
            🚨 EMERGENCY ALERT
          </h2>

          <p>
            You did not respond to the
            SHIELD safety warning.
          </p>

          {emergencyContact ? (
            <>
              <p>
                🆘 Emergency Contact:
                <br />
                <strong>
                  {emergencyContact.name}
                </strong>
              </p>

              <p>
                📞 {emergencyContact.phone}
              </p>
                            <button
                onClick={sendSOS}
                style={{
                  padding: "12px 25px",
                  marginTop: "10px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                🆘 Send SOS
              </button>
            </>
          ) : (
            <p>
              ⚠️ No emergency contact has
              been added.
            </p>
          )}

          {location && (
            <p>
              📍 Current Location:
              <br />
              {location.latitude.toFixed(6)},
              {" "}
              {location.longitude.toFixed(6)}
            </p>
          )}

          <button
            onClick={() => {
              setSosReady(false);
              setWarningActive(false);
              setCountdown(120);
            }}
            style={{
              padding: "12px 25px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            ✅ I'm Okay
          </button>
        </div>
      )}

      {/* =========================
          SAFE ROUTE MESSAGE
          ========================= */}

      {!isDeviated &&
        safeRoute.length > 0 &&
        deviationDistance !== null && (
          <p>
            🟢 You are on the Safe Route
            <br />
            Distance from route:{" "}
            {Math.round(
              deviationDistance
            )}{" "}
            m
          </p>
        )}

      
            {/* =========================
          EMERGENCY CONTACT
          ========================= */}

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "12px",
        }}
      >
        <h3>🆘 Emergency Contact</h3>

        {emergencyContact ? (
          <div>
            <p>
              <strong>Name:</strong>{" "}
              {emergencyContact.name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {emergencyContact.phone}
            </p>

            <button
              onClick={deleteEmergencyContact}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              🗑️ Remove Contact
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              placeholder="Emergency contact name"
              value={emergencyName}
              onChange={(e) =>
                setEmergencyName(e.target.value)
              }
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />

            <input
              type="tel"
              placeholder="Emergency contact phone number"
              value={emergencyPhone}
              onChange={(e) =>
                setEmergencyPhone(e.target.value)
              }
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                marginBottom: "10px",
                boxSizing: "border-box",
              }}
            />

            <button
              onClick={saveEmergencyContact}
              style={{
                padding: "10px 15px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ➕ Save Emergency Contact
            </button>
          </div>
        )}
      </div>
       {/*=========================
          LOCATION
          ========================= */}

      {location && (
        <div>
          <h3>
            Current Location
          </h3>

          <p>
            <strong>
              Latitude:
            </strong>{" "}
            {location.latitude.toFixed(
              6
            )}
          </p>

          <p>
            <strong>
              Longitude:
            </strong>{" "}
            {location.longitude.toFixed(
              6
            )}
          </p>

          <p>
            <strong>
              Speed:
            </strong>{" "}
            {location.speed
              ? `${(
                  location.speed *
                  3.6
                ).toFixed(1)} km/h`
              : "0 km/h"}
          </p>

          <p>
            <strong>
              Last Updated:
            </strong>{" "}
            {location.time}
          </p>
        </div>
      )}

      {/* =========================
          ROUTE POINTS
          ========================= */}

      <div>
        <h3>
          Route Points Recorded
        </h3>

        <p>
          {route.length} location
          points
        </p>
      </div>

      {/* =========================
          BUTTONS
          ========================= */}

      <div
        style={{
          display: "flex",
          gap: "10px",
          margin: "15px 0",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={saveSafeRoute}
          style={{
            padding: "10px 15px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
          }}
        >
          📍 Set Current Route as
          Safe Route
        </button>

        {safeRoute.length > 0 && (
          <button
            onClick={clearSafeRoute}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            🗑️ Clear Safe Route
          </button>
        )}
      </div>

      {/* =========================
          MAP
          ========================= */}

      <div
        style={{
          width: "100%",
          height: "400px",
          marginTop: "20px",
          borderRadius: "15px",
          overflow: "hidden",
        }}
      >
        <MapContainer
          center={currentPosition}
          zoom={16}
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapUpdater
            location={location}
          />

          {/* CURRENT LOCATION */}

          <Marker
            position={currentPosition}
            icon={shieldIcon}
          />

          {/* LIVE TRAVELED ROUTE */}

          {route.length > 1 && (
            <Polyline
              positions={route}
              pathOptions={{
                color: "#7c3aed",
                weight: 5,
              }}
            />
          )}

          {/* SAFE ROUTE */}

          {safeRoute.length > 1 && (
            <Polyline
              positions={safeRoute}
              pathOptions={{
                color: "#22c55e",
                weight: 7,
                opacity: 0.8,
              }}
            />
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default RouteTracker;