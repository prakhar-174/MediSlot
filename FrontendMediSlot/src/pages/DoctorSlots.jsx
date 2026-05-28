import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, LayoutDashboard, Clock, CheckCircle, Trash2 } from 'lucide-react';
import Button from '../components/Button';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const DoctorSlots = () => {
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newSlot, setNewSlot] = useState({ day_of_week: 'Mon', start_time: '', end_time: '' });
  const [addingSlot, setAddingSlot] = useState(false);

  const [blockDate, setBlockDate] = useState('');
  const [blockingDate, setBlockingDate] = useState(false);

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const navItems = [
    { path: '/dashboard/doctor', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/doctor/schedule', label: 'My Schedule', icon: Calendar, exact: false },
    { path: '/dashboard/doctor/requests', label: 'Appointment Requests', icon: Clock, exact: false },
    { path: '/dashboard/doctor/slots', label: 'Manage Slots', icon: CheckCircle, exact: false },
  ];

  useEffect(() => {
    loadSlots();
  }, []);

  const loadSlots = async () => {
    try {
      const data = await fetchApi('/doctors/slots/');
      setSlots(data);
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

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setAddingSlot(true);
    try {
      const res = await fetchApi('/doctors/slots/', {
        method: 'POST',
        body: JSON.stringify(newSlot)
      });
      showToast('Slot created successfully');
      setSlots([...slots, { ...newSlot, id: res.id }]);
      setNewSlot({ day_of_week: 'Mon', start_time: '', end_time: '' }); // Reset form
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (id) => {
    const previous = [...slots];
    setSlots(prev => prev.filter(s => s.id !== id));
    try {
      await fetchApi('/doctors/slots/', {
        method: 'DELETE',
        body: JSON.stringify({ slot_id: id })
      });
      showToast('Slot deleted successfully');
    } catch (error) {
      showToast(error.message, 'error');
      setSlots(previous);
    }
  };

  const handleBlockDate = async (e) => {
    e.preventDefault();
    if (!blockDate) return;
    setBlockingDate(true);
    try {
      await fetchApi('/doctors/slots/block/', {
        method: 'POST',
        body: JSON.stringify({ date: blockDate })
      });
      showToast(`Date ${blockDate} blocked successfully`);
      setBlockDate('');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setBlockingDate(false);
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
            <h1 className="text-2xl font-semibold text-text-h">Manage Slots</h1>
            <p className="text-sm text-text-tertiary">Configure your weekly availability and block specific dates.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Manage Weekly Slots */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-text-h">Weekly Schedule</h2>
              
              <form onSubmit={handleAddSlot} className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-text-tertiary/10 rounded-md shadow-1 items-end">
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Day</label>
                  <select 
                    required
                    className="w-full h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none bg-white"
                    value={newSlot.day_of_week}
                    onChange={(e) => setNewSlot({ ...newSlot, day_of_week: e.target.value })}
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Start Time</label>
                  <input 
                    type="time" 
                    required
                    className="w-full h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none"
                    value={newSlot.start_time}
                    onChange={(e) => setNewSlot({ ...newSlot, start_time: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1 flex-1 w-full">
                  <label className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">End Time</label>
                  <input 
                    type="time" 
                    required
                    className="w-full h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none"
                    value={newSlot.end_time}
                    onChange={(e) => setNewSlot({ ...newSlot, end_time: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="primary" className="h-10 w-full sm:w-auto" disabled={addingSlot}>
                  {addingSlot ? 'Adding...' : 'Add Slot'}
                </Button>
              </form>

              <div className="bg-white rounded-md border border-text-tertiary/10 overflow-hidden shadow-1">
                <div className="flex flex-col divide-y divide-text-tertiary/10">
                  {slots.length === 0 ? (
                    <div className="p-4 text-center text-sm text-text-tertiary">No slots configured.</div>
                  ) : (
                    slots.map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-4 hover:bg-surface-strong/50 duration-instant">
                        <div className="flex items-center gap-4">
                          <span className="w-12 text-sm font-bold text-text-primary">{slot.day_of_week}</span>
                          <span className="text-sm text-text-tertiary">{slot.start_time} - {slot.end_time}</span>
                        </div>
                        <button 
                          onClick={() => handleDeleteSlot(slot.id)}
                          className="p-2 text-text-tertiary hover:text-status-rejected hover:bg-status-rejected/10 rounded-full duration-instant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Block Dates */}
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold text-text-h">Block Specific Date</h2>
              <form onSubmit={handleBlockDate} className="flex flex-col gap-4 p-4 bg-white border border-text-tertiary/10 rounded-md shadow-1">
                <p className="text-sm text-text-tertiary">
                  Select a specific date to block. Patients will not be able to book appointments on this day.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                  <input 
                    type="date" 
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none"
                    value={blockDate}
                    onChange={(e) => setBlockDate(e.target.value)}
                  />
                  <Button type="submit" className="w-full sm:w-auto bg-text-primary text-white hover:bg-text-h h-10" disabled={blockingDate}>
                    {blockingDate ? 'Blocking...' : 'Block Date'}
                  </Button>
                </div>
              </form>
            </div>

          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorSlots;
