import { useEffect, useState } from "react";
import ConfessionForm from "../components/ConfessionForm";
import ConfessionCard from "../components/ConfessionCard";

function Home({ token, view, user }) {
  const [confessions, setConfessions] = useState([]);

  const fetchConfessions = async () => {
    try {
      let url = "http://localhost:5000/confessions";

      if (view === "my") {
        url = "http://localhost:5000/confessions/my";
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,   // 🔥 IMPORTANT
        },
      });

      const data = await res.json();

      if (Array.isArray(data)) {
        setConfessions(data);
      } else {
        setConfessions([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchConfessions();
    }
  }, [view, token]);

  const totalReactions = confessions.reduce((total, c) => {
    return (
      total +
      (c.reactions?.like || 0) +
      (c.reactions?.love || 0) +
      (c.reactions?.laugh || 0)
    );
  }, 0);

  return (
    <>
      {view === "dashboard" && (
        <>
          <h2>Welcome {user?.name || "User"} 👋</h2>

          <div className="stats">
            <div className="stat-card">
              <h3>Total Confessions</h3>
              <p>{confessions.length}</p>
            </div>

            <div className="stat-card">
              <h3>Total Reactions</h3>
              <p>{totalReactions}</p>
            </div>
          </div>

          <ConfessionForm token={token} refresh={fetchConfessions} />

          {confessions.map((confession) => (
            <ConfessionCard
              key={confession._id}
              confession={confession}
              refresh={fetchConfessions}
              token={token}
            />
          ))}
        </>
      )}

      {view === "my" && (
        <>
          <h2>My Confessions</h2>

          {confessions.length === 0 ? (
            <p style={{ marginTop: "20px", color: "#777" }}>
              You haven’t posted any confessions yet.
            </p>
          ) : (
            confessions.map((confession) => (
              <ConfessionCard
                key={confession._id}
                confession={confession}
                refresh={fetchConfessions}
                token={token}
              />
            ))
          )}
        </>
      )}
    </>
  );
}

export default Home;