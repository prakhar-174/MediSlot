import React, { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Calendar, LayoutDashboard, Clock, CheckCircle } from 'lucide-react';
import Card from '../components/Card';
import DashboardLayout from '../components/DashboardLayout';
import { fetchApi } from '../utils/api';
import { useToast } from '../components/Toast';

const DoctorDashboard = () => {
  const containerRef = useRef(null);
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navItems = [
    { path: '/dashboard/doctor', label: 'Dashboard Overview', icon: LayoutDashboard, exact: true },
    { path: '/dashboard/doctor/schedule', label: 'My Schedule', icon: Calendar, exact: false },
    { path: '/dashboard/doctor/requests', label: 'Appointment Requests', icon: Clock, exact: false },
    { path: '/dashboard/doctor/slots', label: 'Manage Slots', icon: CheckCircle, exact: false },
  ];

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await fetchApi('/doctors/dashboard/');
      setStats(data);
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

  return (
    <DashboardLayout role="doctor" navItems={navItems}>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-4 border-role-doctor border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div ref={containerRef} className="flex flex-col gap-8">
          
          <div>
            <h1 className="text-2xl font-semibold text-text-h">Overview</h1>
            <p className="text-sm text-text-tertiary">Here is what is happening at your clinic today.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white flex flex-col gap-2">
              <span className="text-sm font-medium text-text-tertiary">Today's Appointments</span>
              <span className="text-3xl font-bold text-text-h">{stats?.todayCount || 0}</span>
            </Card>
            <Card className={`flex flex-col gap-2 duration-300 ${stats?.pendingCount > 0 ? 'bg-status-pending/10 border border-status-pending/30' : 'bg-white'}`}>
              <span className={`text-sm font-medium ${stats?.pendingCount > 0 ? 'text-status-pending' : 'text-text-tertiary'}`}>Pending Approvals</span>
              <span className={`text-3xl font-bold ${stats?.pendingCount > 0 ? 'text-status-pending' : 'text-text-h'}`}>{stats?.pendingCount || 0}</span>
            </Card>
            <Card className="bg-white flex flex-col gap-2">
              <span className="text-sm font-medium text-text-tertiary">Upcoming Confirmed</span>
              <span className="text-3xl font-bold text-text-h">{stats?.upcomingCount || 0}</span>
            </Card>
            <Card className="bg-white flex flex-col gap-2">
              <span className="text-sm font-medium text-text-tertiary">Total Completed</span>
              <span className="text-3xl font-bold text-text-h">{stats?.completedCount || 0}</span>
            </Card>
          </div>

        </div>
      )}
    </DashboardLayout>
  );
};

export default DoctorDashboard;
