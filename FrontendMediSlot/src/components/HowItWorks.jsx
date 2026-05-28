import React from 'react';
import StatusBadge from './StatusBadge';

const HowItWorks = () => {
  const steps = [
    {
      num: "01",
      title: "Patient Request",
      desc: "Patient browses verified doctors, selects an available time slot, and sends a booking request.",
      status: "pending"
    },
    {
      num: "02",
      title: "Doctor Review",
      desc: "The doctor is notified instantly, reviews the request on their dashboard, and approves it.",
      status: "approved"
    },
    {
      num: "03",
      title: "Visit & Completion",
      desc: "The patient attends the visit. The doctor then marks the appointment as completed for the record.",
      status: "completed"
    }
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text-h">How it works</h2>
          <p className="text-text-tertiary text-sm md:text-md">A seamless flow from booking to completion.</p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {steps.map((step, i) => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-surface-strong text-text-primary font-semibold text-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-1 z-10">
                {step.num}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-md bg-surface-strong border border-text-tertiary/20 shadow-1 hover:shadow-2 duration-instant hover:-translate-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="text-md font-semibold text-text-h">{step.title}</h3>
                  <StatusBadge status={step.status} />
                </div>
                <p className="text-text-tertiary text-sm leading-relaxed">{step.desc}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
