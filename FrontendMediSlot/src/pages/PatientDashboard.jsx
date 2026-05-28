import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Search, User as UserIcon } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../components/DashboardLayout';

const PatientDashboard = () => {
  const navigate = useNavigate();
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

  const mockAppointments = [
    { id: 1, doctor: 'Dr. Sarah Jenkins', spec: 'Cardiologist', date: 'Oct 24, 2026', time: '10:00 AM', status: 'approved' },
    { id: 2, doctor: 'Dr. Ramesh Gupta', spec: 'General Physician', date: 'Oct 28, 2026', time: '02:30 PM', status: 'pending' },
    { id: 3, doctor: 'Dr. Emily Chen', spec: 'Dermatologist', date: 'Nov 02, 2026', time: '11:15 AM', status: 'approved' },
  ];

  return (
    <DashboardLayout role="patient" navItems={navItems}>
      <div ref={containerRef} className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-h">My Dashboard</h1>
            <p className="text-sm text-text-tertiary">Here is an overview of your health schedule.</p>
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/dashboard/patient/find-doctors')}
            className="w-full sm:w-auto"
          >
            Book New Appointment
          </Button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Upcoming Appointments</span>
            <span className="text-3xl font-bold text-text-h">2</span>
          </Card>
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Pending Requests</span>
            <span className="text-3xl font-bold text-text-h">1</span>
          </Card>
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Total Visits</span>
            <span className="text-3xl font-bold text-text-h">14</span>
          </Card>
        </div>

        {/* Appointments List */}
        <div>
          <h2 className="text-lg font-semibold text-text-h mb-4">Upcoming Appointments</h2>
          <div className="bg-white rounded-md border border-text-tertiary/10 overflow-hidden shadow-1">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-surface-strong border-b border-text-tertiary/10 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              <div className="col-span-5">Doctor</div>
              <div className="col-span-4">Date & Time</div>
              <div className="col-span-3">Status</div>
            </div>
            
            <div className="flex flex-col divide-y divide-text-tertiary/10">
              {mockAppointments.map((apt) => (
                <div key={apt.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-strong/50 duration-instant">
                  <div className="col-span-1 sm:col-span-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-role-patient/10 text-role-patient flex items-center justify-center font-bold text-sm shrink-0">
                      DR
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">{apt.doctor}</p>
                      <p className="text-xs text-text-tertiary">{apt.spec}</p>
                    </div>
                  </div>
                  <div className="col-span-1 sm:col-span-4 flex flex-col">
                    <span className="text-sm text-text-primary">{apt.date}</span>
                    <span className="text-xs text-text-tertiary">{apt.time}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-3">
                    <StatusBadge status={apt.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;
