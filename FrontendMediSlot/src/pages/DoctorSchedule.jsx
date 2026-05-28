import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const DoctorSchedule = () => {
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default to today
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const navItems = [
    { path: '/dashboard/doctor', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/doctor/schedule', label: 'My Schedule', icon: Calendar, exact: false },
    { path: '/dashboard/doctor/requests', label: 'Appointment Requests', icon: Clock, exact: false },
    { path: '/dashboard/doctor/slots', label: 'Manage Slots', icon: CheckCircle, exact: false },
  ];

  useEffect(() => {
    loadSchedule();
  }, [date]);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await fetchApi(`/doctors/schedule/?date=${date}`);
      // Sort by time_slot
      data.sort((a, b) => a.time_slot.localeCompare(b.time_slot));
      setSchedule(data);
      setLoading(false);
      
      setTimeout(() => {
        if (containerRef.current) {
          gsap.fromTo(
            containerRef.current.children,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out' }
          );
        }
      }, 0);
    } catch (error) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id) => {
    // Optimistic update
    const previous = [...schedule];
    setSchedule(prev => prev.map(s => s.id === id ? { ...s, status: 'completed' } : s));

    try {
      await fetchApi(`/doctors/appointments/${id}/action/`, {
        method: 'POST',
        body: JSON.stringify({ action: 'completed' })
      });
      showToast('Appointment marked as completed');
    } catch (error) {
      showToast(error.message, 'error');
      // Revert on error
      setSchedule(previous);
    }
  };

  return (
    <DashboardLayout role="doctor" navItems={navItems}>
      <div className="flex flex-col gap-8 max-w-4xl">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-h">My Schedule</h1>
            <p className="text-sm text-text-tertiary">View your approved appointments for the selected date.</p>
          </div>
          
          <div className="flex flex-col gap-1 w-full sm:w-auto">
            <input 
              type="date" 
              className="h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-role-doctor border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div ref={containerRef} className="flex flex-col gap-4">
            {schedule.length === 0 ? (
              <div className="p-8 text-center bg-white border border-text-tertiary/10 rounded-md text-text-tertiary">
                No appointments scheduled for {date}.
              </div>
            ) : (
              schedule.map((slot) => (
                <Card key={slot.id} className="bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-role-patient/10 text-role-patient flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                      {slot.patient_name.substring(0, 2)}
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary">{slot.patient_name}</h3>
                      <p className="text-xs text-text-tertiary">{slot.reason}</p>
                      <p className="text-xs font-semibold text-text-primary mt-1">{slot.time_slot}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-0 border-text-tertiary/10 pt-4 sm:pt-0">
                    <StatusBadge status={slot.status} />
                    {slot.status === 'approved' && (
                      <button 
                        onClick={() => handleMarkComplete(slot.id)}
                        className="text-xs font-semibold px-3 py-1.5 bg-status-approved text-white rounded-sm hover:bg-status-approved/90 duration-instant"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DoctorSchedule;
