import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../components/DashboardLayout';

const DoctorDashboard = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  const navItems = [
    { path: '/dashboard/doctor', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { path: '#', label: 'My Schedule', icon: Calendar, exact: false },
    { path: '#', label: 'Appointment Requests', icon: Clock, exact: false },
    { path: '#', label: 'Manage Slots', icon: CheckCircle, exact: false },
  ];

  const mockRequests = [
    { id: 1, patient: 'Michael T.', reason: 'Routine checkup', date: 'Oct 24, 2026', time: '10:00 AM' },
    { id: 2, patient: 'Sarah K.', reason: 'Fever and chills', date: 'Oct 24, 2026', time: '11:30 AM' },
    { id: 3, patient: 'James L.', reason: 'Post-surgery follow up', date: 'Oct 25, 2026', time: '09:00 AM' },
    { id: 4, patient: 'Emily R.', reason: 'Consultation', date: 'Oct 25, 2026', time: '02:15 PM' },
  ];

  const mockSchedule = [
    { id: 1, patient: 'John Doe', time: '09:00 AM - 09:30 AM', status: 'approved' },
    { id: 2, patient: 'Amanda Smith', time: '10:30 AM - 11:00 AM', status: 'approved' },
    { id: 3, patient: 'Robert Chen', time: '01:00 PM - 01:30 PM', status: 'completed' },
  ];

  return (
    <DashboardLayout role="doctor" navItems={navItems}>
      <div ref={containerRef} className="flex flex-col gap-8">
        
        {/* Header Actions */}
        <div>
          <h1 className="text-2xl font-semibold text-text-h">Overview</h1>
          <p className="text-sm text-text-tertiary">Here is what is happening at your clinic today.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Today's Appointments</span>
            <span className="text-3xl font-bold text-text-h">3</span>
          </Card>
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Pending Approvals</span>
            <span className="text-3xl font-bold text-text-h">4</span>
          </Card>
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Total Patients</span>
            <span className="text-3xl font-bold text-text-h">128</span>
          </Card>
          <Card className="bg-white flex flex-col gap-2">
            <span className="text-sm font-medium text-text-tertiary">Completed Sessions</span>
            <span className="text-3xl font-bold text-text-h">45</span>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Appointment Requests */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-text-h mb-4">Appointment Requests</h2>
            <div className="bg-white rounded-md border border-text-tertiary/10 overflow-hidden shadow-1">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-surface-strong border-b border-text-tertiary/10 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                <div className="col-span-4">Patient</div>
                <div className="col-span-4">Date & Time</div>
                <div className="col-span-4 text-right">Actions</div>
              </div>
              
              <div className="flex flex-col divide-y divide-text-tertiary/10">
                {mockRequests.map((req) => (
                  <div key={req.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-strong/50 duration-instant">
                    <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-strong border border-text-tertiary/10 flex items-center justify-center font-bold text-sm text-text-primary shrink-0">
                        {req.patient.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{req.patient}</p>
                        <p className="text-xs text-text-tertiary">{req.reason}</p>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-4 flex flex-col">
                      <span className="text-sm text-text-primary">{req.date}</span>
                      <span className="text-xs text-text-tertiary">{req.time}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-4 flex gap-2 sm:justify-end">
                      <Button variant="primary" className="h-8 px-4 text-xs">Approve</Button>
                      <button className="h-8 px-4 text-xs font-semibold rounded-sm border border-status-rejected text-status-rejected hover:bg-status-rejected/10 duration-instant">
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Today's Schedule */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-text-h mb-4">Today's Schedule</h2>
            <div className="flex flex-col gap-4">
              {mockSchedule.map((slot) => (
                <Card key={slot.id} className="bg-white flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-tertiary">{slot.time}</span>
                    <StatusBadge status={slot.status} className="!scale-90 origin-right" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-role-patient/10 text-role-patient flex items-center justify-center font-bold text-xs shrink-0">
                      PT
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{slot.patient}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default DoctorDashboard;
