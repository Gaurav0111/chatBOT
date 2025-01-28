// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import OrganizationSetup from "./components/OrganizationSetup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/organization" element={<OrganizationSetup />} />
        {/* Add other routes here if needed */}
      </Routes>
    </Router>
  );
}

export default App;
