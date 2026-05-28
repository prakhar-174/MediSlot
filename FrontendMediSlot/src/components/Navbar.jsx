import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav aria-label="Main navigation" className="bg-surface-base text-text-secondary border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-lg font-bold tracking-tight hover:opacity-80 duration-instant">
          MediSlot
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="/#features" className="text-sm font-medium hover:opacity-100 opacity-80 duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Features</a>
          <a href="/#how-it-works" className="text-sm font-medium hover:opacity-100 opacity-80 duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">How it Works</a>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="h-[44px] px-8 text-sm font-semibold rounded-sm border border-white hover:bg-white/10 duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white inline-flex items-center justify-center">
            Sign In
          </Link>
          <Link to="/signup" className="h-[44px] px-8 text-sm font-semibold rounded-sm bg-white text-surface-base hover:brightness-90 duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white inline-flex items-center justify-center">
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 -mr-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-surface-base border-b border-white/10 flex flex-col p-6 gap-6">
          <a href="/#features" onClick={() => setIsOpen(false)} className="text-md font-medium">Features</a>
          <a href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-md font-medium">How it Works</a>
          <div className="flex flex-col gap-4 mt-4 pt-6 border-t border-white/10">
            <Link to="/login" onClick={() => setIsOpen(false)} className="w-full h-[44px] border border-white rounded-sm font-semibold inline-flex items-center justify-center">Sign In</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full h-[44px] bg-white text-surface-base rounded-sm font-semibold inline-flex items-center justify-center">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
