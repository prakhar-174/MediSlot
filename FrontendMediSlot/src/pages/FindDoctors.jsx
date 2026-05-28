import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, Search, User as UserIcon, Star } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import DashboardLayout from '../components/DashboardLayout';

const FindDoctors = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  const navItems = [
    { path: '/dashboard/patient/find-doctors', label: 'Find Doctors', icon: Search, exact: false },
    { path: '/dashboard/patient', label: 'My Appointments', icon: Calendar, exact: true },
    { path: '#', label: 'Profile', icon: UserIcon, exact: false },
  ];

  const mockDoctors = [
    { id: 1, name: 'Dr. Sarah Jenkins', spec: 'Cardiologist', rating: 4.9, days: ['Mon', 'Wed', 'Fri'] },
    { id: 2, name: 'Dr. Ramesh Gupta', spec: 'General Physician', rating: 4.8, days: ['Tue', 'Thu', 'Sat'] },
    { id: 3, name: 'Dr. Emily Chen', spec: 'Dermatologist', rating: 4.7, days: ['Mon', 'Tue', 'Wed'] },
    { id: 4, name: 'Dr. Michael Scott', spec: 'Pediatrician', rating: 4.9, days: ['Mon', 'Thu', 'Fri'] },
    { id: 5, name: 'Dr. Lisa Kudrow', spec: 'Neurologist', rating: 4.6, days: ['Wed', 'Fri', 'Sun'] },
    { id: 6, name: 'Dr. James Wilson', spec: 'Oncologist', rating: 4.8, days: ['Mon', 'Tue', 'Thu'] },
  ];

  return (
    <DashboardLayout role="patient" navItems={navItems}>
      <div ref={containerRef} className="flex flex-col gap-8">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text-h">Find Doctors</h1>
          <p className="text-sm text-text-tertiary">Book an appointment with our trusted specialists.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockDoctors.map((doc) => (
            <Card key={doc.id} className="bg-white flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-strong border border-text-tertiary/10 flex items-center justify-center font-bold text-text-primary text-sm shrink-0">
                    {doc.name.charAt(4)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{doc.name}</h3>
                    <p className="text-xs text-text-tertiary">{doc.spec}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-text-primary">
                  <Star className="w-3 h-3 fill-role-doctor text-role-doctor" />
                  {doc.rating}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-2 block">Available Days</span>
                <div className="flex gap-2">
                  {doc.days.map(day => (
                    <span key={day} className="px-2 py-1 bg-surface-strong text-text-primary text-xs rounded-sm border border-text-tertiary/10">
                      {day}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <Button variant="primary" className="w-full h-9 text-xs">Book Appointment</Button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default FindDoctors;
