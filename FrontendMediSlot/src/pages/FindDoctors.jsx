import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, Search, User as UserIcon, Star, X, ChevronDown } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const FindDoctors = () => {
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Filter State
  const [activeFilter, setActiveFilter] = useState('All'); // 'All', 'Available Now', 'By Specialization', 'Top Rated'
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [specializations, setSpecializations] = useState([]);

  // Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({ date: '', time_slot: '', reason: '' });
  const [bookingLoading, setBookingLoading] = useState(false);

  const navItems = [
    { path: '/dashboard/patient/find-doctors', label: 'Find Doctors', icon: Search, exact: false },
    { path: '/dashboard/patient', label: 'My Appointments', icon: Calendar, exact: true },
    { path: '/dashboard/patient/profile', label: 'Profile', icon: UserIcon, exact: false },
  ];

  // Fetch unique specializations once on mount
  useEffect(() => {
    fetchApi('/doctors/list/').then(data => {
      const specs = [...new Set(data.map(d => d.specialization))].filter(Boolean);
      setSpecializations(specs);
    }).catch(err => console.error("Failed to load specializations", err));
  }, []);

  useEffect(() => {
    loadDoctors();
  }, [activeFilter, selectedSpecialization]);

  const loadDoctors = async () => {
    setLoading(true);
    try {
      let query = '';
      if (activeFilter === 'Available Now') {
        query = '?availability=true';
      } else if (activeFilter === 'By Specialization' && selectedSpecialization) {
        query = `?specialization=${encodeURIComponent(selectedSpecialization)}`;
      } else if (activeFilter === 'Top Rated') {
        query = '?sort=rating';
      }

      const data = await fetchApi(`/doctors/list/${query}`);
      
      // Frontend Sort: Available doctors float to top, then by rating
      if (activeFilter !== 'Top Rated') {
        data.sort((a, b) => {
          if (a.isAvailable && !b.isAvailable) return -1;
          if (!a.isAvailable && b.isAvailable) return 1;
          return b.rating - a.rating;
        });
      }

      setDoctors(data);
      setLoading(false);
      
      setTimeout(() => {
        if (containerRef.current) {
          gsap.fromTo(
            containerRef.current.children,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' }
          );
        }
      }, 0);
    } catch (error) {
      showToast(error.message, 'error');
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(search.toLowerCase()) || 
    doc.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingData({ date: '', time_slot: '', reason: '' });
  };

  const closeBookingModal = () => {
    setSelectedDoctor(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingData.date || !bookingData.time_slot) {
      showToast('Please select a date and time', 'error');
      return;
    }

    setBookingLoading(true);
    try {
      await fetchApi('/bookings/prebook/', {
        method: 'POST',
        body: JSON.stringify({
          doctor_id: selectedDoctor.id,
          ...bookingData
        })
      });
      showToast('Appointment requested successfully!');
      closeBookingModal();
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const getAvailableTimeSlots = () => {
    if (!selectedDoctor || !bookingData.date) return [];
    const dateObj = new Date(bookingData.date);
    const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    
    const slot = selectedDoctor.slots.find(s => s.day_of_week === dayOfWeek);
    if (!slot) return [];

    const slots = [];
    let startHour = parseInt(slot.start_time.split(':')[0], 10);
    let endHour = parseInt(slot.end_time.split(':')[0], 10);
    
    for (let i = startHour; i < endHour; i++) {
      const ampm = i >= 12 ? 'PM' : 'AM';
      const hr = i > 12 ? i - 12 : (i === 0 ? 12 : i);
      const nextAmpm = (i+1) >= 12 ? 'PM' : 'AM';
      const nextHr = (i+1) > 12 ? (i+1) - 12 : ((i+1) === 0 ? 12 : (i+1));
      slots.push(`${hr}:00 ${ampm} - ${nextHr}:00 ${nextAmpm}`);
    }
    return slots;
  };

  const availableTimeSlots = getAvailableTimeSlots();

  return (
    <DashboardLayout role="patient" navItems={navItems}>
      <div className="flex flex-col gap-8">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-text-h">Find Doctors</h1>
          <p className="text-sm text-text-tertiary">Book an appointment with our trusted specialists.</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative max-w-md">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-text-tertiary/20 rounded-md focus:border-text-primary focus:ring-1 focus:ring-text-primary outline-none duration-instant"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'Available Now', 'Top Rated', 'By Specialization'].map(f => (
              <div key={f} className="relative group">
                <button
                  onClick={() => {
                    setActiveFilter(f);
                    if (f !== 'By Specialization') setSelectedSpecialization('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold duration-instant flex items-center gap-1 ${
                    activeFilter === f 
                      ? 'bg-surface-base text-white border border-transparent' 
                      : 'bg-transparent text-text-primary border border-text-tertiary/30 hover:border-text-primary'
                  }`}
                >
                  {f}
                  {f === 'By Specialization' && <ChevronDown className="w-4 h-4 ml-1" />}
                </button>

                {/* Specialization Dropdown */}
                {f === 'By Specialization' && activeFilter === 'By Specialization' && (
                  <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-text-tertiary/10 rounded-md shadow-2 z-20 py-1 hidden group-focus-within:block group-hover:block animate-in fade-in zoom-in-95 duration-fast">
                    {specializations.length === 0 ? (
                      <div className="px-4 py-2 text-sm text-text-tertiary">No specializations found</div>
                    ) : (
                      specializations.map(spec => (
                        <button
                          key={spec}
                          className="w-full text-left px-4 py-2 text-sm text-text-primary hover:bg-surface-strong duration-instant"
                          onClick={() => setSelectedSpecialization(spec)}
                        >
                          {spec}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            ))}
            
            {activeFilter === 'By Specialization' && selectedSpecialization && (
              <span className="text-sm font-semibold text-text-tertiary bg-white px-3 py-1.5 rounded-full border border-text-tertiary/20">
                {selectedSpecialization}
              </span>
            )}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-md p-6 h-48 animate-pulse flex flex-col justify-between border border-text-tertiary/10">
                 <div className="flex gap-3">
                   <div className="w-12 h-12 bg-surface-strong rounded-full"></div>
                   <div className="flex flex-col gap-2 flex-1 pt-1">
                     <div className="h-4 bg-surface-strong rounded w-3/4"></div>
                     <div className="h-3 bg-surface-strong rounded w-1/2"></div>
                   </div>
                 </div>
                 <div className="h-9 bg-surface-strong rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.length === 0 ? (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-center bg-white rounded-md border border-text-tertiary/10">
                <p className="text-text-primary font-semibold text-lg mb-2">No doctors found.</p>
                <p className="text-text-tertiary text-sm mb-4">Check back soon or browse all doctors.</p>
                <Button variant="primary" onClick={() => { setActiveFilter('All'); setSearch(''); }}>
                  Show All Doctors
                </Button>
              </div>
            ) : (
              filteredDoctors.map((doc) => {
                const availableDays = [...new Set(doc.slots.map(s => s.day_of_week))];
                return (
                  <Card key={doc.id} className={`bg-white flex flex-col gap-4 relative transition-opacity duration-300 ${!doc.isAvailable ? 'opacity-60 grayscale-[50%]' : ''}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full bg-surface-strong border border-text-tertiary/10 flex items-center justify-center font-bold text-text-primary text-sm shrink-0 uppercase">
                          {doc.name.substring(0, 2)}
                          {doc.isAvailable && (
                            <span className="absolute top-0 right-0 w-3 h-3 bg-status-approved rounded-full ring-2 ring-white"></span>
                          )}
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-text-primary">{doc.name}</h3>
                          <p className="text-xs text-text-tertiary">{doc.specialization}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-text-primary bg-surface-strong px-2 py-1 rounded-sm">
                        <Star className="w-3 h-3 fill-role-doctor text-role-doctor" />
                        {doc.rating}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-text-tertiary tracking-wider mb-2 block">Available Days</span>
                      <div className="flex flex-wrap gap-2">
                        {availableDays.length === 0 ? (
                          <span className="text-xs text-text-tertiary font-medium">Currently Unavailable</span>
                        ) : (
                          availableDays.map(day => (
                            <span key={day} className="px-2 py-1 bg-surface-strong text-text-primary text-[10px] font-semibold rounded-sm border border-text-tertiary/10">
                              {day}
                            </span>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="mt-2">
                      <Button 
                        variant="primary" 
                        className="w-full h-9 text-xs"
                        onClick={() => handleBookClick(doc)}
                        disabled={!doc.isAvailable}
                      >
                        {doc.isAvailable ? 'Book Appointment' : 'Not Available'}
                      </Button>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-fast">
          <div className="bg-white rounded-lg shadow-2 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-fast flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-text-tertiary/10 shrink-0">
              <h2 className="text-lg font-semibold text-text-h">Book Appointment</h2>
              <button onClick={closeBookingModal} className="p-1 text-text-tertiary hover:text-text-primary rounded-full hover:bg-surface-strong duration-instant">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
              <div className="flex items-center gap-3 mb-6 p-3 bg-surface-strong rounded-md">
                 <div className="w-10 h-10 rounded-full bg-white border border-text-tertiary/10 flex items-center justify-center font-bold text-text-primary text-sm shrink-0 uppercase">
                    {selectedDoctor.name.substring(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{selectedDoctor.name}</h3>
                    <p className="text-xs text-text-tertiary">{selectedDoctor.specialization}</p>
                  </div>
              </div>

              <form id="booking-form" onSubmit={handleBookingSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-primary">Select Date</label>
                  <input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none"
                    value={bookingData.date}
                    onChange={(e) => {
                      const dateObj = new Date(e.target.value);
                      const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                      const availableDays = selectedDoctor.slots.map(s => s.day_of_week);
                      
                      if (e.target.value && !availableDays.includes(dayOfWeek)) {
                        showToast(`Doctor is only available on ${availableDays.join(', ')}`, 'error');
                        return;
                      }
                      setBookingData({ ...bookingData, date: e.target.value, time_slot: '' });
                    }}
                  />
                  <p className="text-xs text-text-tertiary mt-1">Available: {selectedDoctor.slots.map(s => s.day_of_week).join(', ')}</p>
                </div>

                {bookingData.date && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-text-primary">Select Time Slot</label>
                    {availableTimeSlots.length === 0 ? (
                      <div className="w-full h-10 px-3 rounded-sm border border-text-tertiary/30 bg-surface-strong flex items-center text-sm text-status-rejected font-medium">
                        No slots available for this date
                      </div>
                    ) : (
                      <select 
                        required
                        className="w-full h-10 px-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none bg-white"
                        value={bookingData.time_slot}
                        onChange={(e) => setBookingData({ ...bookingData, time_slot: e.target.value })}
                      >
                        <option value="">Select a time</option>
                        {availableTimeSlots.map(slot => (
                          <option key={slot} value={slot}>{slot}</option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-text-primary">Reason for Visit</label>
                  <textarea 
                    required
                    maxLength={300}
                    rows={3}
                    placeholder="Briefly describe your symptoms..."
                    className="w-full p-3 rounded-sm border border-text-tertiary/30 focus:border-text-primary outline-none resize-none"
                    value={bookingData.reason}
                    onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                  ></textarea>
                  <div className="flex justify-end">
                    <span className="text-[10px] text-text-tertiary">{bookingData.reason.length}/300</span>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-4 border-t border-text-tertiary/10 bg-surface-strong shrink-0 flex justify-end gap-3">
              <Button type="button" onClick={closeBookingModal} className="bg-white text-text-primary hover:bg-surface-base">
                Cancel
              </Button>
              <Button 
                type="submit" 
                form="booking-form" 
                variant="primary" 
                disabled={bookingLoading || (bookingData.date && availableTimeSlots.length === 0)}
              >
                {bookingLoading ? 'Requesting...' : 'Confirm Request'}
              </Button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default FindDoctors;
