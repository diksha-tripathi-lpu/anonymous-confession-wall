function ConfessionCard({ confession, refresh }) {

const react = async (type) => {
  await fetch(
    `http://localhost:5000/confessions/${confession._id}/react`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type }),
    }
  );

  refresh();
};

const handleDelete = async () => {
  const code = prompt("Enter secret code to delete:");
  if (!code) return;

  const res = await fetch(
    `http://localhost:5000/confessions/${confession._id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ secretCode: code }),
    }
  );

  const data = await res.json();
  alert(data.message);

  refresh();
};

const handleEdit = async () => {
  const code = prompt("Enter secret code:");
  if (!code) return;

  // 🔥 First verify secret code using current text
  const verifyRes = await fetch(
    `http://localhost:5000/confessions/${confession._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text: confession.text, secretCode: code }),
    }
  );

  const verifyData = await verifyRes.json();

  if (!verifyRes.ok) {
    alert(verifyData.message);
    return; // 🚨 stop if wrong code
  }

  // ✅ Only now ask for new text
  const newText = prompt("Enter new confession text:");
  if (!newText) return;

  const res = await fetch(
    `http://localhost:5000/confessions/${confession._id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ text: newText, secretCode: code }),
    }
  );

  const data = await res.json();
  alert(data.message || "Updated");

  refresh();
};

  return (
    <div className="card">
      <p>{confession.text}</p>

<button className="reaction" onClick={() => react("like")}>
  👍 {confession.reactions.like}
</button>

<button className="reaction" onClick={() => react("love")}>
  ❤️ {confession.reactions.love}
</button>

<button className="reaction" onClick={() => react("laugh")}>
  😂 {confession.reactions.laugh}
</button>

      <br /><br />

      <div style={{ marginTop: "15px" }}>
  <button className="edit-btn" onClick={handleEdit}>
    Edit
  </button>

  <button className="delete-btn" onClick={handleDelete}>
    Delete
  </button>
</div>
    </div>
  );
}

export default ConfessionCard;