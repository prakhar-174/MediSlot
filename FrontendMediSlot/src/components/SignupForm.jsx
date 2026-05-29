import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { User, Stethoscope } from 'lucide-react';
import { fetchApi } from '../utils/api';

const SignupForm = () => {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    days: []
  });

  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleDayToggle = (day) => {
    setFormData(prev => {
      const days = prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day];
      return { ...prev, days };
    });
  };

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const payload = {
        username: formData.email, // backend expects username
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: role,
      };

      if (role === 'doctor') {
        payload.specialization = formData.specialization;
        payload.availableDays = formData.days;
      }

      const data = await fetchApi('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      localStorage.setItem('token', data.access);
      localStorage.setItem('user', JSON.stringify({ role: data.role, name: data.name }));

      navigate(`/dashboard/${data.role}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-fast">
      {/* Role Toggle */}
      <div className="flex p-1 bg-surface-strong rounded-sm border border-text-tertiary/10">
        <button
          type="button"
          onClick={() => setRole('patient')}
          className={`flex-1 flex items-center justify-center gap-2 h-10 text-sm font-semibold rounded-sm duration-instant ${
            role === 'patient' ? 'bg-white shadow-2 text-role-patient' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          <User className="w-4 h-4" /> Patient
        </button>
        <button
          type="button"
          onClick={() => setRole('doctor')}
          className={`flex-1 flex items-center justify-center gap-2 h-10 text-sm font-semibold rounded-sm duration-instant ${
            role === 'doctor' ? 'bg-white shadow-2 text-role-doctor' : 'text-text-tertiary hover:text-text-primary'
          }`}
        >
          <Stethoscope className="w-4 h-4" /> Doctor
        </button>
      </div>

      <Input label="Full Name" id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
      <Input label="Email Address" id="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input label="Password" id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required />
        <Input label="Confirm Password" id="confirmPassword" type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} required />
      </div>

      {role === 'doctor' && (
        <div className="flex flex-col gap-6 border-t border-text-tertiary/10 pt-6 mt-2 animate-in fade-in slide-in-from-top-4 duration-instant">
          <Input label="Specialization" id="specialization" placeholder="e.g. Cardiologist" value={formData.specialization} onChange={handleChange} required />
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-primary">Available Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDayToggle(day)}
                  className={`h-10 px-4 text-xs font-semibold rounded-sm border duration-instant ${
                    formData.days.includes(day)
                      ? 'bg-role-doctor text-white border-role-doctor'
                      : 'bg-white text-text-tertiary border-text-tertiary/30 hover:border-text-primary'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <Button type="submit" variant="primary" className="w-full mt-2">
        Create Account
      </Button>
      {error && <p className="text-status-rejected text-sm text-center">{error}</p>}
    </form>
  );
};

export default SignupForm;
