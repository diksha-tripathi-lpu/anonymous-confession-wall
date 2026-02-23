import { useState, useEffect } from "react";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import "./index.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [view, setView] = useState("dashboard");

  useEffect(() => {
  if (token) {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUser(decoded);
  }
}, [token]);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return (
      <div className="login-wrapper">
        <Auth setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="sidebar">
        <div>
          <div className="logo">Campus Wall</div>

          <div
            className={`menu-item ${view === "dashboard" ? "active" : ""}`}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </div>

          <div
            className={`menu-item ${view === "my" ? "active" : ""}`}
            onClick={() => setView("my")}
          >
            My Confessions
          </div>
        </div>

        <button className="sidebar-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="main">
        <Home
          token={token}
          view={view}
          user={user}
        />
      </div>
    </div>
  );
}

export default App;