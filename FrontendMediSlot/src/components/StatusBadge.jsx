import React from 'react';
import { Clock, CheckCircle, XCircle, Check, MinusCircle } from 'lucide-react';

const StatusBadge = ({ status, className = '' }) => {
  const config = {
    pending: { color: 'text-status-pending', bg: 'bg-status-pending/12', icon: Clock },
    approved: { color: 'text-status-approved', bg: 'bg-status-approved/12', icon: CheckCircle },
    rejected: { color: 'text-status-rejected', bg: 'bg-status-rejected/12', icon: XCircle },
    completed: { color: 'text-text-tertiary', bg: 'bg-text-tertiary/12', icon: Check },
    cancelled: { color: 'text-text-tertiary', bg: 'bg-text-tertiary/12', icon: MinusCircle },
  };

  const current = config[status.toLowerCase()] || config.pending;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-2xl text-xs font-semibold uppercase tracking-wider ${current.bg} ${current.color} ${className}`}>
      <Icon className="w-[14px] h-[14px] mr-2" />
      {status}
    </span>
  );
};

export default StatusBadge;
