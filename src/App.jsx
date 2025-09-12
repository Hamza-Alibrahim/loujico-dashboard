// src/App.jsx
import "./i18n";
import React, { useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/LogIn";
import { AuthProvider } from "./Context/AuthContext";
import Header from "./components/Header";
import Users from "./components/Users";
import Clients from "./components/Clients";
import Employees from "./components/Employees";
import Projects from "./components/Projects";
import Invoices from "./components/Invoices";
import SideBar from "./components/SideBar";
import Products from "./components/Products";
import Logs from "./components/Logs";

const App = () => {
  const location = useLocation();
  const isAuthPage =
    location.pathname === "/" || location.pathname === "/signup";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <main className={`flex min-h-screen ${isAuthPage ? "bg-gray-100" : ""}`}>
        {!isAuthPage && (
          <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        )}
        <div className={isAuthPage ? "w-full" : "parent max-lg:!w-full"}>
          {!isAuthPage && <Header onToggleSidebar={toggleSidebar} />}
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/customers" element={<Clients />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/products" element={<Products />} />
            <Route path="/logs" element={<Logs />} />
          </Routes>
        </div>
      </main>
    </AuthProvider>
  );
};

export default App;
