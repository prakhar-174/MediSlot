import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, Search, User as UserIcon } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const PatientProfile = () => {
  const containerRef = useRef(null);
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const navItems = [
    { path: '/dashboard/patient/find-doctors', label: 'Find Doctors', icon: Search, exact: false },
    { path: '/dashboard/patient', label: 'My Appointments', icon: Calendar, exact: true },
    { path: '/dashboard/patient/profile', label: 'Profile', icon: UserIcon, exact: false },
  ];

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await fetchApi('/auth/me/');
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
      });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetchApi('/auth/update-profile/', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      // Update local storage name if changed
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      user.name = formData.name;
      localStorage.setItem('user', JSON.stringify(user));

      showToast('Profile updated successfully!');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout role="patient" navItems={navItems}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-role-patient border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={containerRef} className="flex flex-col gap-8 max-w-2xl">
          <div>
            <h1 className="text-2xl font-semibold text-text-h">My Profile</h1>
            <p className="text-sm text-text-tertiary">Update your personal information.</p>
          </div>

          <Card className="bg-white">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <Input 
                label="Full Name" 
                id="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Email Address" 
                id="email" 
                type="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <Input 
                label="Phone Number" 
                id="phone" 
                type="tel" 
                value={formData.phone} 
                onChange={handleChange} 
              />
              
              <div className="flex justify-end mt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PatientProfile;
