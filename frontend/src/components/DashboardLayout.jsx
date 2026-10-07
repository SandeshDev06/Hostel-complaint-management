import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar onToggleSidebar={toggleSidebar} />

      <div className="d-flex flex-grow-1">
        {/* Responsive Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

        {/* Main Content Area */}
        <main className="main-content flex-grow-1">
          <div key={location.pathname} className="page-enter">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
