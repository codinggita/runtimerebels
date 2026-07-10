import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Approvals from "./pages/Approvals";
import Arena from "./pages/Arena";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ minHeight: "100vh", backgroundColor: "var(--bmw-canvas)" }}>
        <Navbar />
        <Sidebar />
        <main className="bmw-main-container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/approvals" element={<Approvals />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
