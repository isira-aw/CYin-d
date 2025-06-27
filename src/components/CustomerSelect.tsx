import React from 'react';
import { Customer } from '../types/api';
import { User } from 'lucide-react';

interface CustomerSelectProps {
  customers: Customer[];
  selectedEmail: string;
  onEmailChange: (email: string) => void;
  loading?: boolean;
}

export const CustomerSelect: React.FC<CustomerSelectProps> = ({
  customers,
  selectedEmail,
  onEmailChange,
  loading = false
}) => {
  const validCustomers = customers.filter(customer => 
    customer.email && customer.email.trim() !== '' &&
    customer.customerName && customer.customerName.trim() !== ''
  );

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        <User className="w-4 h-4 inline mr-2" />
        Select Customer
      </label>
      <select
        value={selectedEmail}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={loading}
        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <option value="">Choose a customer...</option>
        {validCustomers.map((customer) => (
          <option key={customer.id} value={customer.email}>
            {customer.customerName} ({customer.email})
          </option>
        ))}
      </select>
      {validCustomers.length === 0 && !loading && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No customers available
        </p>
      )}
    </div>
  );
};