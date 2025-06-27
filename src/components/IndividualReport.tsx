import React, { useState, useEffect } from 'react';
import { Customer, CustomerReport } from '../types/api';
import { apiService } from '../services/api';
import { CustomerSelect } from './CustomerSelect';
import { DatePicker } from './DatePicker';
import { ActivityTable } from './ActivityTable';
import { Search, Loader2, AlertCircle, User } from 'lucide-react';

interface IndividualReportProps {
  customers: Customer[];
  loading: boolean;
}

export const IndividualReport: React.FC<IndividualReportProps> = ({ 
  customers, 
  loading: customersLoading 
}) => {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [report, setReport] = useState<CustomerReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!selectedEmail || !selectedDate) {
      setError('Please select both a customer and a date');
      return;
    }

    setLoading(true);
    setError(null);
    setReport(null);

    try {
      const reportData = await apiService.getCustomerReport(selectedEmail, selectedDate);
      setReport(reportData);
    } catch (err) {
      setError('Failed to fetch report. Please try again.');
      console.error('Error fetching report:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectedCustomer = customers.find(c => c.email === selectedEmail);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Individual Customer Report
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <CustomerSelect
            customers={customers}
            selectedEmail={selectedEmail}
            onEmailChange={setSelectedEmail}
            loading={customersLoading}
          />
          
          <DatePicker
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading || !selectedEmail || !selectedDate}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span>{loading ? 'Searching...' : 'Search Report'}</span>
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}
      </div>

      {report && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
              Report Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Customer</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {report.customerName || selectedCustomer?.customerName || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Role</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {report.role || 'No role specified'}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400">Total Activities</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  {report.activities ? report.activities.length : 0}
                </p>
              </div>
            </div>
            {report.description && (
              <div className="mt-4">
                <p className="text-sm text-slate-600 dark:text-slate-400">Description</p>
                <p className="text-slate-900 dark:text-white">{report.description}</p>
              </div>
            )}
          </div>

          <ActivityTable 
            activities={report.activities || []} 
            customerName={report.customerName || selectedCustomer?.customerName}
          />
        </div>
      )}
    </div>
  );
};