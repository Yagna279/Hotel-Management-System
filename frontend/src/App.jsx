import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [time, setTime] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/")
      .then((response) => {
        setMessage(response.data.database);
        setTime(response.data.time);
      })
      .catch((error) => {
        console.error(error);
        setMessage("Backend not connected");
      });
  }, []);

  return (
    <div className="app">
      <h1>🏨 Hotel Management System</h1>
      <p>Welcome to the Hotel Management System.</p>

      <h3>Database Status: {message}</h3>
      <p>{time}</p>

      <button>Login</button>
    </div>
  );
}

export default App;