import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./lib/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Approvals from "./pages/Approvals";
import Arena from "./pages/Arena";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function AppLayout() {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bmw-canvas)" }}>
      <Navbar />
      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <Sidebar />
        <main 
          className="bmw-main-container" 
          style={{ 
            flexGrow: 1, 
            display: "flex", 
            flexDirection: "column",
            minHeight: "100%" 
          }}
        >
          <div style={{ flexGrow: 1 }}>
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Flows */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Flows */}
          <Route path="/upload" element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          } />
          
          {/* Core App dashboard, arena, approvals (with Navbar/Sidebar layout) */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/approvals" element={<Approvals />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
