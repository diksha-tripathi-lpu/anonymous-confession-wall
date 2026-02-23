import { useState } from "react";

function ConfessionForm({ token, refresh }) {
  const [text, setText] = useState("");
  const [secretCode, setSecretCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (secretCode.length < 4) {
      alert("Secret code must be at least 4 characters");
      return;
    }

    await fetch("http://localhost:5000/confessions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ text, secretCode }),
    });

    setText("");
    setSecretCode("");
    refresh();
  };

  return (
    <div className="form-card">
      <h3>Post a Confession</h3>

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Write your confession..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Secret Code (min 4 characters)"
          value={secretCode}
          onChange={(e) => setSecretCode(e.target.value)}
          required
        />

        <div className="form-actions">
          <button className="primary-btn" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default ConfessionForm;