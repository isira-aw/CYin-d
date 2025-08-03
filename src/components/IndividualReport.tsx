import React, { useState } from 'react';
import { Calendar, Download, User, MapPin, Clock, Timer } from 'lucide-react';

interface Customer {
  id: number;
  customerName: string;
  email: string;
  role: string;
  password: string;
}

interface IndividualReportProps {
  customers: Customer[];
}

interface ReportData {
  reportPeriod: string;
  role: string;
  eventDetails: Array<{
    date: string;
    location: string;
    time: string;
    status: string;
  }>;
  customerName: string;
  email: string;
}

const BASE_URL = "https://cyin-production.up.railway.app";
// const BASE_URL = 'http://localhost:8080';

export const IndividualReport: React.FC<IndividualReportProps> = ({ customers }) => {
  const [selectedEmail, setSelectedEmail] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    if (!selectedEmail || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/api/report/generate-user-report-json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedEmail,
          startDate,
          endDate,
        }),
      });

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!selectedEmail || !startDate || !endDate) {
      setError('Please fill in all fields');
      return;
    }

    const url = `${BASE_URL}/api/report/generate-report?email=${selectedEmail}&startDate=${startDate}&endDate=${endDate}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <User className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Individual Customer Report</h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Select Customer
          </label>
          <select
            value={selectedEmail}
            onChange={(e) => setSelectedEmail(e.target.value)}
            className="w-full px-4 py-3 bg-slate-500 border border-slate-600 rounded-xl text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Choose a customer...</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.email}>
                {customer.customerName} ({customer.email})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={generateReport}
          disabled={loading}
          className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar className="w-5 h-5" />
          <span>{loading ? 'Generating...' : 'Generate Report'}</span>
        </button>

        <button
          onClick={downloadPDF}
          className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
        >
          <Download className="w-5 h-5" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Report Data */}
      {reportData && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
          <div className="border-b border-slate-700 pb-4">
            <h3 className="text-xl font-bold text-white mb-2">Report Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Customer:</span>
                <p className="text-white font-medium">{reportData.customerName}</p>
              </div>
              <div>
                <span className="text-slate-400">Email:</span>
                <p className="text-white font-medium">{reportData.email}</p>
              </div>
              <div>
                <span className="text-slate-400">Role:</span>
                <p className="text-white font-medium">{reportData.role}</p>
              </div>
            </div>
            <div className="mt-2">
              <span className="text-slate-400">Report Period:</span>
              <p className="text-white font-medium">{reportData.reportPeriod}</p>
            </div>
          </div>

          {/* Event Details */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-400" />
              <span>Event Details ({reportData.eventDetails.length} events)</span>
            </h4>
            
            {reportData.eventDetails.length > 0 ? (
              <div className="space-y-3">
                {reportData.eventDetails.map((event, index) => (
                  <div key={index} className="bg-slate-700/30 border border-slate-600 rounded-lg p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <div>
                          <span className="text-slate-400">Date:</span>
                          <p className="text-white font-medium">{event.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-green-400" />
                        <div>
                          <span className="text-slate-400">Location:</span>
                          <p className="text-white font-medium">{event.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Timer className="w-4 h-4 text-purple-400" />
                        <div>
                          <span className="text-slate-400">Time:</span>
                          <p className="text-white font-medium">{event.time}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400">Status:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                          event.status === 'go' ? 'bg-green-500/20 text-green-400' :
                          event.status === 'ending' ? 'bg-yellow-500/20 text-yellow-400' :
                          event.status === 'ko' ? 'bg-red-500/20 text-red-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-8">No events found for the selected period</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};