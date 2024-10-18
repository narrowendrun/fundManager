import React, { useState } from "react";

const RepopulateTables = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleRepopulate = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/repopulate_tables", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Tables repopulated successfully.");
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Repopulate Tables</h2>
      <button onClick={handleRepopulate} disabled={loading}>
        {loading ? "Repopulating..." : "Repopulate Tables"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RepopulateTables;
