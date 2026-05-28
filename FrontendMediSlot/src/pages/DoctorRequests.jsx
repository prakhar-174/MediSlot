import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';
import Button from '../components/Button';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const DoctorRequests = () => {
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { path: '/dashboard/doctor', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/doctor/schedule', label: 'My Schedule', icon: Calendar, exact: false },
    { path: '/dashboard/doctor/requests', label: 'Appointment Requests', icon: Clock, exact: false },
    { path: '/dashboard/doctor/slots', label: 'Manage Slots', icon: CheckCircle, exact: false },
  ];

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await fetchApi('/doctors/appointments/?status=pending');
      setRequests(data);
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

  const handleAction = async (id, action) => {
    // Optimistic update
    const previous = [...requests];
    setRequests(prev => prev.filter(req => req.id !== id)); // Remove from pending list

    try {
      await fetchApi(`/doctors/appointments/${id}/action/`, {
        method: 'POST',
        body: JSON.stringify({ action })
      });
      showToast(`Appointment ${action} successfully`);
    } catch (error) {
      showToast(error.message, 'error');
      // Revert on error
      setRequests(previous);
    }
  };

  return (
    <DashboardLayout role="doctor" navItems={navItems}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-role-doctor border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={containerRef} className="flex flex-col gap-8">
          
          <div>
            <h1 className="text-2xl font-semibold text-text-h">Appointment Requests</h1>
            <p className="text-sm text-text-tertiary">Review and approve new appointment requests from patients.</p>
          </div>

          <div className="bg-white rounded-md border border-text-tertiary/10 overflow-hidden shadow-1 max-w-5xl">
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-surface-strong border-b border-text-tertiary/10 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
              <div className="col-span-4">Patient</div>
              <div className="col-span-4">Date & Time</div>
              <div className="col-span-4 text-right">Actions</div>
            </div>
            
            <div className="flex flex-col divide-y divide-text-tertiary/10">
              {requests.length === 0 ? (
                <div className="p-8 text-center text-text-tertiary">No pending requests at the moment.</div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-strong/50 duration-instant">
                    <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-strong border border-text-tertiary/10 flex items-center justify-center font-bold text-sm text-text-primary shrink-0 uppercase">
                        {req.patient_name.charAt(0)}{req.patient_name.charAt(1) || ''}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{req.patient_name}</p>
                        <p className="text-xs text-text-tertiary">{req.reason}</p>
                      </div>
                    </div>
                    <div className="col-span-1 sm:col-span-4 flex flex-col">
                      <span className="text-sm text-text-primary">{req.date}</span>
                      <span className="text-xs text-text-tertiary">{req.time_slot}</span>
                    </div>
                    <div className="col-span-1 sm:col-span-4 flex gap-2 sm:justify-end">
                      <Button 
                        variant="primary" 
                        className="h-8 px-4 text-xs"
                        onClick={() => handleAction(req.id, 'approved')}
                      >
                        Approve
                      </Button>
                      <button 
                        onClick={() => handleAction(req.id, 'rejected')}
                        className="h-8 px-4 text-xs font-semibold rounded-sm border border-status-rejected text-status-rejected hover:bg-status-rejected/10 duration-instant"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorRequests;
