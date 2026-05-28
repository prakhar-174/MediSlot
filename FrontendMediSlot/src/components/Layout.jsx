import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import PageLoader from './PageLoader';

const Layout = () => {
  const [loading, setLoading] = useState(true);

  // Fallback to ensure loader unmounts if animation fails
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <PageLoader onComplete={() => setLoading(false)} />}
      <div 
        className="min-h-screen flex flex-col transition-opacity duration-fast"
        style={{ opacity: loading ? 0 : 1, pointerEvents: loading ? 'none' : 'auto' }}
      >
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
