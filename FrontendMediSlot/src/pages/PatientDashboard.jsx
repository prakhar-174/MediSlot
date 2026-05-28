import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Search, User as UserIcon } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, upcoming, completed, cancelled

  const navItems = [
    { path: '/dashboard/patient/find-doctors', label: 'Find Doctors', icon: Search, exact: false },
    { path: '/dashboard/patient', label: 'My Appointments', icon: Calendar, exact: true },
    { path: '/dashboard/patient/profile', label: 'Profile', icon: UserIcon, exact: false },
  ];

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await fetchApi('/bookings/');
      data.sort((a, b) => new Date(a.date) - new Date(b.date));
      setAppointments(data);
      setLoading(false);
      
      // Check for updated statuses
      const lastCheck = localStorage.getItem('lastAppointmentCheck');
      if (lastCheck) {
        const lastCheckTime = new Date(lastCheck).getTime();
        const updatedAppts = data.filter(a => new Date(a.created_at || new Date()).getTime() > lastCheckTime || true); // We actually don't have an updated_at field, so we can store the previous state or just check if there's any status that is not pending and we haven't seen it yet.
      }
      // A better approach since we don't have updated_at is to store the actual stringified state of appointments.
      const previousState = JSON.parse(localStorage.getItem('patientAppointmentsState') || '{}');
      let statusChanged = false;
      
      const currentState = {};
      data.forEach(a => {
        currentState[a.id] = a.status;
        if (previousState[a.id] && previousState[a.id] !== a.status) {
            statusChanged = true;
        }
      });
      
      localStorage.setItem('patientAppointmentsState', JSON.stringify(currentState));
      
      if (statusChanged) {
        showToast('You have new updates to your appointment statuses!');
      }

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

  const handleCancel = async (id) => {
    // Optimistic update
    const previous = [...appointments];
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'cancelled' } : a));

    try {
      await fetchApi(`/bookings/${id}/cancel/`, { method: 'POST' });
      showToast('Appointment cancelled successfully');
    } catch (error) {
      showToast(error.message, 'error');
      // Revert on error
      setAppointments(previous);
    }
  };

  const getFilteredAppointments = () => {
    if (filter === 'all') return appointments;
    if (filter === 'upcoming') return appointments.filter(a => ['pending', 'approved', 'confirmed'].includes(a.status));
    return appointments.filter(a => a.status === filter);
  };

  const filteredData = getFilteredAppointments();

  return (
    <DashboardLayout role="patient" navItems={navItems}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-role-patient border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={containerRef} className="flex flex-col gap-8">
          
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-text-h">My Appointments</h1>
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
              <span className="text-3xl font-bold text-text-h">
                {appointments.filter(a => ['pending', 'approved', 'confirmed'].includes(a.status)).length}
              </span>
            </Card>
            <Card className="bg-white flex flex-col gap-2">
              <span className="text-sm font-medium text-text-tertiary">Pending Requests</span>
              <span className="text-3xl font-bold text-text-h">
                {appointments.filter(a => a.status === 'pending').length}
              </span>
            </Card>
            <Card className="bg-white flex flex-col gap-2">
              <span className="text-sm font-medium text-text-tertiary">Total Visits</span>
              <span className="text-3xl font-bold text-text-h">
                {appointments.filter(a => a.status === 'completed').length}
              </span>
            </Card>
          </div>

          {/* Appointments List */}
          <div>
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2">
              {['all', 'upcoming', 'completed', 'cancelled'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full capitalize duration-instant whitespace-nowrap ${
                    filter === tab
                      ? 'bg-role-patient text-white'
                      : 'bg-white text-text-tertiary hover:bg-surface-strong hover:text-text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-md border border-text-tertiary/10 overflow-hidden shadow-1">
              <div className="hidden sm:grid grid-cols-12 gap-4 p-4 bg-surface-strong border-b border-text-tertiary/10 text-xs font-semibold text-text-tertiary uppercase tracking-wider">
                <div className="col-span-4">Doctor</div>
                <div className="col-span-3">Date & Time</div>
                <div className="col-span-3">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              
              <div className="flex flex-col divide-y divide-text-tertiary/10">
                {filteredData.length === 0 ? (
                  <div className="p-8 text-center text-text-tertiary">No appointments found.</div>
                ) : (
                  filteredData.map((apt) => (
                    <div key={apt.id} className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center hover:bg-surface-strong/50 duration-instant">
                      <div className="col-span-1 sm:col-span-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-role-patient/10 text-role-patient flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                          {apt.doctor_name.charAt(0)}{apt.doctor_name.charAt(1) || ''}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-text-primary">{apt.doctor_name}</p>
                          <p className="text-xs text-text-tertiary">{apt.doctor_specialization}</p>
                        </div>
                      </div>
                      <div className="col-span-1 sm:col-span-3 flex flex-col">
                        <span className="text-sm text-text-primary">{apt.date}</span>
                        <span className="text-xs text-text-tertiary">{apt.time_slot}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-3">
                        <StatusBadge status={apt.status === 'confirmed' ? 'approved' : apt.status} />
                      </div>
                      <div className="col-span-1 sm:col-span-2 flex justify-end">
                        {apt.status === 'pending' && (
                          <button 
                            onClick={() => handleCancel(apt.id)}
                            className="text-xs font-semibold text-status-rejected hover:bg-status-rejected/10 px-3 py-1.5 rounded-sm duration-instant"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientDashboard;
