import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Bell, LogOut } from 'lucide-react';

const DashboardLayout = ({ role, navItems, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userName = user.name || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login', { replace: true });
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
            <button className="relative p-2 text-text-tertiary hover:text-text-primary duration-instant focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-surface-base rounded-full">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-status-rejected rounded-full"></span>
            </button>
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
