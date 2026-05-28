import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-surface-base text-text-secondary py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 border-t border-white/10 pt-8">
        <div className="text-lg font-bold tracking-tight">
          MediSlot
        </div>
        
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs font-medium opacity-70 hover:opacity-100 duration-instant">Privacy Policy</a>
          <a href="#" className="text-xs font-medium opacity-70 hover:opacity-100 duration-instant">Terms of Service</a>
          <a href="#" className="text-xs font-medium opacity-70 hover:opacity-100 duration-instant">Contact Support</a>
        </div>
        
        <p className="text-xs opacity-50">
          &copy; {new Date().getFullYear()} MediSlot. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
