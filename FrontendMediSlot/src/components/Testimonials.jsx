import React from 'react';
import Card from './Card';

const Testimonials = () => {
  const reviews = [
    {
      name: "Dr. Sarah Jenkins",
      role: "Cardiologist",
      quote: "MediSlot completely transformed how my clinic handles appointments. The role-based dashboard is a lifesaver and saves us hours daily."
    },
    {
      name: "Michael T.",
      role: "Patient",
      quote: "Finally, a booking system that doesn't feel like it was built in 1995. Clean, fast, and I get instant approvals on my phone."
    },
    {
      name: "Dr. Ramesh Gupta",
      role: "General Physician",
      quote: "I save at least two hours a day not having to play phone tag with patients. I highly recommend this platform to any modern clinic."
    }
  ];

  return (
    <section className="py-24 px-6 bg-surface-strong border-t border-text-tertiary/10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text-h">What people are saying</h2>
          <p className="text-text-tertiary text-sm md:text-md">Trusted by doctors and patients everywhere.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <Card key={i} className="flex flex-col bg-white">
              <div className="flex-grow">
                <p className="text-text-primary text-sm leading-relaxed mb-6 italic">"{review.quote}"</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-strong flex items-center justify-center text-text-tertiary font-bold text-xs">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-h text-sm">{review.name}</p>
                  <p className="text-xs text-text-tertiary">{review.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
