import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "../styles/Dashboard.css";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar />

      <main className="dashboard-main">
        <Navbar />
        <section className="dashboard-content">{children}</section>
      </main>
    </div>
  );
};

export default DashboardLayout;