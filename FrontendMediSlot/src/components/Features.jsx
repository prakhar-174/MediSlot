import React from 'react';
import Card from './Card';
import { ShieldCheck, CalendarCheck, History } from 'lucide-react';

const Features = () => {
  const features = [
    {
      title: "Role-Based Access",
      desc: "Distinct views for patients and doctors. Patients browse and book; doctors manage slots and approve.",
      icon: ShieldCheck,
      color: "text-role-doctor"
    },
    {
      title: "Instant Approvals",
      desc: "No more phone tag. Doctors see requests immediately and can approve or reject with a single click.",
      icon: CalendarCheck,
      color: "text-status-approved"
    },
    {
      title: "Secure History",
      desc: "A centralized, reliable record of all past and upcoming visits, accessible anytime by both parties.",
      icon: History,
      color: "text-role-patient"
    }
  ];

  return (
    <section id="features" className="py-24 px-6 bg-surface-strong">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-lg md:text-xl font-semibold mb-4 text-text-h">Built for modern clinics</h2>
          <p className="text-text-tertiary text-sm md:text-md max-w-2xl mx-auto">
            Everything you need to digitize your appointment lifecycle, packed into an interface that feels clean and intuitive.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, i) => (
            <Card key={i} hoverable className="flex flex-col items-start bg-white">
              <div className={`p-3 rounded-2xl bg-surface-strong mb-6 ${feat.color}`}>
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="text-md font-semibold text-text-h mb-3">{feat.title}</h3>
              <p className="text-text-tertiary text-sm leading-relaxed">{feat.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
