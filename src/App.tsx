import { useState } from "react";
import axios from "axios";

function App() {
  const [appName, setAppName] = useState("Unkown");

  const fetchAppName = async () => {
    try {
      const response = await axios.get(
        "https://flowchatbackend.azurewebsites.net/api/System/getWebName"
      );
      setAppName(response.data);
    } catch (error) {
      console.error("Error fetching the app name:", error);
    }
  };

  return (
    <div className="flex place-content-center place-items-center h-screen">
      <div className="card bg-primary size-fit card-xl">
        <div className="card-body">
          <h2 className="card-title">App Name</h2>
          <p>{appName}</p>
          <div className="justify-end card-actions">
            <button onClick={fetchAppName} className="btn">
              Fetch name from API
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
