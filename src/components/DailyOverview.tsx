import React, { useState } from 'react';
import { Customer, CustomerReport } from '../types/api';
import { apiService } from '../services/api';
import { DatePicker } from './DatePicker';
import { DailyOverviewTable } from './DailyOverviewTable';
import { Search, Loader2, AlertCircle, Calendar } from 'lucide-react';

interface DailyOverviewProps {
  customers: Customer[];
  loading: boolean;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({ 
  customers, 
  loading: customersLoading 
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [reports, setReports] = useState<CustomerReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!selectedDate) {
      setError('Please select a date');
      return;
    }

    setLoading(true);
    setError(null);
    setReports([]);

    try {
      const allReports = await apiService.getAllCustomerReports(selectedDate, customers);
      setReports(allReports);
    } catch (err) {
      setError('Failed to fetch daily reports. Please try again.');
      console.error('Error fetching daily reports:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-green-600 mr-3" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Daily Overview Report
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              label="Select Date for Overview"
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={loading || !selectedDate || customersLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{loading ? 'Loading...' : 'Get Daily Report'}</span>
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        {loading && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-blue-700 dark:text-blue-300">
              Fetching reports for all customers... This may take a moment.
            </p>
          </div>
        )}
      </div>

      {reports.length > 0 && (
        <DailyOverviewTable reports={reports} selectedDate={selectedDate} />
      )}
    </div>
  );
};