import React, { useState } from 'react';
import { Calendar, Download, Users, MapPin, Clock, Timer } from 'lucide-react';

interface GroupReportData {
  eventDetails: Array<{
    date: string;
    location: string;
    time: string;
    status: string;
  }>;
  customerName: string;
  email: string;
}

// const BASE_URL = 'http://localhost:8080';
const BASE_URL = "https://cyin-production.up.railway.app";


export const GroupReport: React.FC = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState<GroupReportData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please fill in both start and end dates');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${BASE_URL}/api/report/generate-all-users-report-json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
    if (!startDate || !endDate) {
      setError('Please fill in both start and end dates');
      return;
    }

    const url = `${BASE_URL}/api/report/generate-all-users-report?startDate=${startDate}&endDate=${endDate}`;
    window.open(url, '_blank');
  };

  const getTotalEvents = () => {
    return reportData.reduce((total, user) => total + user.eventDetails.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Users className="w-6 h-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">Group Report - All Users</h2>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Report Summary */}
      {reportData.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Report Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{reportData.length}</div>
              <div className="text-slate-400 text-sm">Total Users</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">{getTotalEvents()}</div>
              <div className="text-slate-400 text-sm">Total Events</div>
            </div>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">{startDate} to {endDate}</div>
              <div className="text-slate-400 text-sm">Report Period</div>
            </div>
          </div>
        </div>
      )}

      {/* Report Data */}
      {reportData.length > 0 && (
        <div className="space-y-6">
          {reportData.map((user, userIndex) => (
            <div key={userIndex} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="border-b border-slate-700 pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white">{user.customerName}</h4>
                    <p className="text-slate-400">{user.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-400">Events</div>
                    <div className="text-xl font-bold text-blue-400">{user.eventDetails.length}</div>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              {user.eventDetails.length > 0 ? (
                <div className="space-y-3">
                  <h5 className="text-md font-semibold text-white flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>Event Details</span>
                  </h5>
                  {user.eventDetails.map((event, eventIndex) => (
                    <div key={eventIndex} className="bg-slate-700/30 border border-slate-600 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
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
                            event.status === 'starting working' ? 'bg-green-500/20 text-green-400' :
                            event.status === 'ending' ? 'bg-yellow-500/20 text-yellow-400' :
                            event.status === 'moving' ? 'bg-red-500/20 text-red-400' :
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
                <p className="text-slate-400 text-center py-4">No events found for this user</p>
              )}
            </div>
          ))}
        </div>
      )}

      {reportData.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Generate a report to view all user activities</p>
        </div>
      )}
    </div>
  );
};