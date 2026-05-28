import React, { useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import StatusBadge from './StatusBadge';

const Hero = () => {
  const floatRef1 = useRef(null);
  const floatRef2 = useRef(null);

  useEffect(() => {
    // GSAP floating animation
    gsap.to(floatRef1.current, {
      y: -15,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });

    gsap.to(floatRef2.current, {
      y: 10,
      duration: 2.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });
  }, []);

  return (
    <section className="bg-surface-base text-text-secondary pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
        
        {/* Left: Text Content */}
        <div className="flex flex-col items-start text-left z-10 relative">
          <h1 className="text-3xl md:text-[60px] leading-[1.1] font-normal mb-6 tracking-tight">
            Eliminate scheduling chaos. <br className="hidden md:block" />
            <span className="text-text-tertiary">Take control of your clinic.</span>
          </h1>
          <p className="text-sm md:text-md text-text-tertiary max-w-xl mb-10 leading-relaxed">
            MediSlot is the clean, role-based platform designed specifically to modernize small clinics. Book patients seamlessly, manage doctor availability instantly, and keep a secure history of every visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link to="/signup" className="h-[44px] px-8 text-sm font-semibold rounded-sm bg-white text-surface-base hover:brightness-90 duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white inline-flex items-center justify-center">
              Book an Appointment <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
            <Link to="/login" className="h-[44px] px-8 text-sm font-semibold rounded-sm border border-white hover:bg-white/10 duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white inline-flex items-center justify-center">
              Are you a doctor?
            </Link>
          </div>
        </div>

        {/* Right: Floating Mockups */}
        <div className="relative hidden lg:block h-[450px]">
          {/* Main Appointment Card */}
          <div 
            ref={floatRef1}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] bg-white p-6 rounded-md shadow-3 border border-text-tertiary/20 z-10"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-role-patient/10 text-role-patient rounded-full flex items-center justify-center font-bold text-lg">
                  DR
                </div>
                <div>
                  <h3 className="text-text-primary font-semibold text-sm">Dr. Ramesh Gupta</h3>
                  <p className="text-text-tertiary text-xs">Cardiologist</p>
                </div>
              </div>
              <StatusBadge status="approved" className="!scale-90 origin-top-right" />
            </div>
            
            <div className="bg-surface-strong p-4 rounded-sm border border-text-tertiary/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-text-primary text-sm font-medium">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <span>Today, 10:30 AM</span>
              </div>
            </div>
          </div>

          {/* Secondary Stats Card */}
          <div 
            ref={floatRef2}
            className="absolute bottom-16 right-0 w-[220px] bg-white p-4 rounded-md shadow-4 border border-text-tertiary/20 z-20 flex items-center gap-4"
          >
            <div className="w-10 h-10 bg-role-doctor/10 text-role-doctor rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-text-primary font-bold text-sm">3 Upcoming</p>
              <p className="text-text-tertiary text-xs">Appointments today</p>
            </div>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-role-patient/20 to-role-doctor/20 blur-3xl rounded-full opacity-30 pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
