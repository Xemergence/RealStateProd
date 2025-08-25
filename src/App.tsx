import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/pages/home";
import Dashboard from "./components/pages/dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;