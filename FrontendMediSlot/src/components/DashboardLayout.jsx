import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Check } from 'lucide-react';
import { fetchApi } from '../utils/api';
import { useToast } from './Toast';

const DashboardLayout = ({ role, navItems, children }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchApi('/auth/notifications/');
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await fetchApi('/auth/notifications/read-all/', { method: 'PATCH' });
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const handleMarkRead = async (id) => {
    // Optimistic UI update
    setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    try {
      await fetchApi(`/auth/notifications/${id}/read/`, { method: 'PATCH' });
    } catch (error) {
      // Revert if error
      loadNotifications();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
  };

  const timeSince = (dateString) => {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  };

  return (
    <div className="flex h-screen bg-surface-strong overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-text-tertiary/10 z-20">
        <div className="h-[70px] flex items-center px-6 border-b border-text-tertiary/10">
          <div className="text-lg font-bold tracking-tight text-surface-base">MediSlot</div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="flex flex-col gap-1 px-4">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.exact}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium duration-instant ${
                      isActive
                        ? role === 'doctor'
                          ? 'bg-role-doctor/10 text-role-doctor'
                          : 'bg-role-patient/10 text-role-patient'
                        : 'text-text-tertiary hover:bg-surface-strong hover:text-text-primary'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-text-tertiary/10">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 w-full rounded-md text-sm font-medium text-status-rejected hover:bg-status-rejected/10 duration-instant"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative">
        {/* Top Bar */}
        <header className="h-[70px] bg-white border-b border-text-tertiary/10 flex items-center justify-between px-6 shrink-0 z-10 relative">
          <div className="flex items-center gap-4">
            <div className="md:hidden text-lg font-bold tracking-tight text-surface-base">MediSlot</div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs text-text-tertiary">Welcome back,</span>
              <span className="text-sm font-semibold text-text-primary">{userName}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {role === 'doctor' && (
              <span className="hidden sm:inline-flex px-3 py-1 bg-role-doctor/10 text-role-doctor text-xs font-bold rounded-full">
                DOCTOR
              </span>
            )}
            
            {/* Notification Bell */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-text-tertiary hover:text-text-primary duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-base rounded-full"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-2 h-2 bg-status-rejected rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-text-tertiary/10 rounded-md shadow-2 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-fast">
                  <div className="flex items-center justify-between p-3 border-b border-text-tertiary/10 bg-surface-strong">
                    <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
                    {unreadCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-role-patient hover:underline font-medium"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                  <div className="max-h-[400px] overflow-y-auto flex flex-col">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-text-tertiary">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => !notif.is_read && handleMarkRead(notif.id)}
                          className={`p-4 border-b border-text-tertiary/5 cursor-pointer flex flex-col gap-1 transition-colors duration-200 ${
                            notif.is_read 
                              ? 'bg-white opacity-70' 
                              : 'bg-status-pending/5 border-l-4 border-l-status-pending'
                          }`}
                        >
                          <p className={`text-sm leading-snug ${notif.is_read ? 'text-text-tertiary' : 'text-text-primary font-medium'}`}>
                            {notif.message}
                          </p>
                          <span className="text-xs text-text-tertiary mt-1">
                            {timeSince(notif.created_at)}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 relative z-0">
          <div className="max-w-6xl mx-auto pb-24 md:pb-0">
            {children || <Outlet />}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-text-tertiary/10 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <ul className="flex items-center justify-around h-16 pb-safe">
          {navItems.map((item) => (
            <li key={item.path} className="flex-1 h-full">
              <NavLink
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center w-full h-full gap-1 duration-instant ${
                    isActive
                      ? role === 'doctor'
                        ? 'text-role-doctor'
                        : 'text-role-patient'
                      : 'text-text-tertiary'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
          <li className="flex-1 h-full">
            <button onClick={handleLogout} className="flex flex-col items-center justify-center w-full h-full gap-1 text-status-rejected">
              <LogOut className="w-5 h-5" />
              <span className="text-[10px] font-medium">Logout</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardLayout;
