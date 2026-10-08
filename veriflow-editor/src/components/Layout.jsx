import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
