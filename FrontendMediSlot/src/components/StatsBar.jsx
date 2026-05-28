import React from 'react';

const StatsBar = () => {
  return (
    <section className="bg-surface-base text-text-secondary py-12 rounded-b-[40px] relative z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 md:gap-24 text-sm font-medium text-text-tertiary">
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-2xl font-bold tracking-tight">500+</span>
          <span>Doctors</span>
        </div>
        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-2xl font-bold tracking-tight">10,000+</span>
          <span>Appointments</span>
        </div>
        <div className="hidden sm:block w-1 h-1 rounded-full bg-white/20"></div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-white text-2xl font-bold tracking-tight">4.9★</span>
          <span>Rating</span>
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
