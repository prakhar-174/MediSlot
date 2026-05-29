import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { User, Stethoscope } from 'lucide-react';
import { fetchApi } from '../utils/api';

const LoginForm = () => {
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await fetchApi('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username: email, password }),
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

      <Input 
        label="Email Address" 
        id="login-email" 
        type="email" 
        placeholder="you@example.com" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <Input 
        label="Password" 
        id="login-password" 
        type="password" 
        placeholder="••••••••" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" variant="primary" className="w-full mt-2">
        Sign In
      </Button>
      {error && <p className="text-status-rejected text-sm text-center">{error}</p>}
    </form>
  );
};

export default LoginForm;
