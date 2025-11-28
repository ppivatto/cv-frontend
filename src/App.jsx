import { useState } from "react";
import Login from "./pages/Login";
import Upload from "./pages/Upload";

function App() {
  const [userId, setUserId] = useState(localStorage.getItem("token"));

  if (!userId) {
    return <Login onLogin={setUserId} />;
  }

  return <Upload userId={userId} />;
}

export default App;
