import React, { useState } from 'react';
import { Customer, CustomerReport } from '../types/api';
import { apiService } from '../services/api';
import { DatePicker } from './DatePicker';
import { DailyOverviewTable } from './DailyOverviewTable';
import { Search, Loader2, AlertCircle, Calendar, Download } from 'lucide-react';

interface DailyOverviewProps {
  customers: Customer[];
  loading: boolean;
}

export const DailyOverview: React.FC<DailyOverviewProps> = ({
  customers,
  loading: customersLoading,
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [fromDate, setFromDate] = useState(today);
  const [toDate, setToDate] = useState(today);
  const [reports, setReports] = useState<CustomerReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getDateRange = (start: string, end: string): string[] => {
    const dates: string[] = [];
    const current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(current.toISOString().split('T')[0]);
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  // Function to calculate the difference between two dates in days
  const getDateDifference = (start: string, end: string): number => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const timeDiff = endDate.getTime() - startDate.getTime();
    return timeDiff / (1000 * 3600 * 24); // Convert time difference from milliseconds to days
  };

  const handleSearch = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both start and end dates.');
      return;
    }

    if (new Date(fromDate) > new Date(toDate)) {
      setError('Start date must be before end date.');
      return;
    }

    const dateDifference = getDateDifference(fromDate, toDate);
    if (dateDifference > 45) {
      setError('You can only search for a maximum of 45 days.');
      return;
    }

    setLoading(true);
    setError(null);
    setReports([]);

    try {
      const dateRange = getDateRange(fromDate, toDate);
      const allReports: CustomerReport[] = [];

      for (const date of dateRange) {
        const dailyReports = await apiService.getAllCustomerReports(date, customers);
        allReports.push(...dailyReports);
      }

      setReports(allReports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      setError('Failed to fetch reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reports.length) return;

    const headers = Object.keys(reports[0]).join(',');
    const rows = reports.map((r) => Object.values(r).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `daily_report_${fromDate}_to_${toDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <div className="flex items-center mb-6">
          <Calendar className="w-6 h-6 text-white mr-3" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Daily Overview Report (Date Range)
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <DatePicker
              selectedDate={fromDate}
              onDateChange={setFromDate}
              label="From Date"
            />
          </div>
          <div className="flex-1">
            <DatePicker
              selectedDate={toDate}
              onDateChange={setToDate}
              label="To Date"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !fromDate || !toDate || customersLoading}
            className="bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            <span>{loading ? 'Loading...' : 'Get Range Report'}</span>
          </button>

          {reports.length > 0 && (
            <button
              onClick={downloadCSV}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download CSV</span>
            </button>
          )}
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
              Fetching reports for selected date range... This may take a moment.
            </p>
          </div>
        )}
      </div>

      {reports.length > 0 && (
        <DailyOverviewTable reports={reports} selectedDate={`${fromDate} to ${toDate}`} />
      )}
    </div>
  );
};
