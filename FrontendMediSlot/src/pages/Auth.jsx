import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ShieldCheck, Calendar, Activity, CheckCircle2 } from 'lucide-react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialMode = location.pathname.includes('signup') ? 'signup' : 'login';
  const [mode, setMode] = useState(initialMode);

  // Sync mode when location changes externally
  useEffect(() => {
    setMode(location.pathname.includes('signup') ? 'signup' : 'login');
  }, [location.pathname]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // Update URL silently without triggering full reload or scroll
    navigate(`/${newMode}`, { replace: true });
  };

  // GSAP Animation Refs
  const iconRef1 = useRef(null);
  const iconRef2 = useRef(null);
  const iconRef3 = useRef(null);

  useEffect(() => {
    gsap.to(iconRef1.current, { y: -20, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to(iconRef2.current, { y: 20, duration: 4, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 1 });
    gsap.to(iconRef3.current, { x: 15, y: -10, duration: 3.5, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 0.5 });
  }, []);

  return (
    <div className="flex-grow flex flex-col lg:flex-row min-h-[85vh]">
      
      {/* Left Panel - Visual Experience (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-surface-base text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-role-patient blur-[100px] rounded-full mix-blend-screen"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-role-doctor blur-[100px] rounded-full mix-blend-screen"></div>
        </div>

        <div className="z-10 mt-12">
          <h2 className="text-4xl font-normal leading-[1.1] mb-6 tracking-tight max-w-md">
            Streamline your clinic. <br />
            <span className="text-text-tertiary">Empower your patients.</span>
          </h2>
          <p className="text-text-tertiary text-sm max-w-md leading-relaxed">
            Join thousands of modern healthcare providers relying on MediSlot for secure, seamless, and intelligent appointment scheduling.
          </p>

          <div className="mt-12 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="w-5 h-5 text-role-doctor" /> Secure patient records
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="w-5 h-5 text-role-doctor" /> Instant approvals
            </div>
            <div className="flex items-center gap-3 text-sm text-white/80">
              <CheckCircle2 className="w-5 h-5 text-role-doctor" /> Zero scheduling conflicts
            </div>
          </div>
        </div>

        {/* Floating Icons Illustration */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 z-10 hidden xl:block">
          <div className="relative w-[300px] h-[300px]">
            <div ref={iconRef1} className="absolute top-0 right-0 w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-role-doctor shadow-2">
              <Calendar className="w-10 h-10" />
            </div>
            <div ref={iconRef2} className="absolute bottom-12 right-12 w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-role-patient shadow-2">
              <Activity className="w-8 h-8" />
            </div>
            <div ref={iconRef3} className="absolute top-1/2 left-0 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white shadow-2">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface-strong p-6 lg:p-12">
        <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-2 border border-text-tertiary/10">
          
          {/* Tab Switcher */}
          <div className="relative flex mb-8 border-b border-text-tertiary/20">
            <button
              onClick={() => handleModeChange('login')}
              className={`flex-1 pb-4 text-center text-sm font-semibold duration-instant ${mode === 'login' ? 'text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
            >
              Log In
            </button>
            <button
              onClick={() => handleModeChange('signup')}
              className={`flex-1 pb-4 text-center text-sm font-semibold duration-instant ${mode === 'signup' ? 'text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}
            >
              Sign Up
            </button>

            {/* Animated Underline */}
            <div 
              className="absolute bottom-[-1px] h-[2px] bg-text-primary transition-all duration-300 ease-out"
              style={{
                width: '50%',
                left: mode === 'login' ? '0%' : '50%'
              }}
            />
          </div>

          {/* Form Area */}
          <div className="min-h-[400px]">
            {mode === 'login' ? <LoginForm /> : <SignupForm />}
          </div>

        </div>
      </div>

    </div>
  );
};

export default Auth;
