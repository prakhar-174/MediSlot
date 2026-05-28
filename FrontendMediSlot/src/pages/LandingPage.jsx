import React from 'react';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import Features from '../components/Features';
import HowItWorks from '../components/HowItWorks';
import Testimonials from '../components/Testimonials';

const LandingPage = () => {
  return (
    <>
      <Hero />
      <StatsBar />
      <Features />
      <HowItWorks />
      <Testimonials />
    </>
  );
};

export default LandingPage;
