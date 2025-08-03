import React, { useState, useEffect } from 'react';
import { RefreshCw, LogOut, User, Calendar, Users, Download } from 'lucide-react';
import { IndividualReport } from './IndividualReport';
import { GroupReport } from './GroupReport';

interface User {
  email: string;
  role: string;
  employeeName?: string;
}

interface Customer {
  id: number;
  customerName: string;
  email: string;
  role: string;
  password: string;
}

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// const BASE_URL = 'http://localhost:8080';
const BASE_URL = "https://cyin-production.up.railway.app";

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'individual' | 'group'>('individual');
  const [refreshMessage, setRefreshMessage] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    setRefreshMessage('');
    try {
      const response = await fetch(`${BASE_URL}/api/report/customers`);
      const data = await response.json();
      setCustomers(data);
      setRefreshMessage('Customer data refreshed successfully!');
      setTimeout(() => setRefreshMessage(''), 3000);
    } catch (error) {
      setRefreshMessage('Failed to fetch customer data');
      setTimeout(() => setRefreshMessage(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-full -m-5 p-0">
              <img
                src="https://github.com/isira-aw/CYin-m/blob/main/CYin-logo.png?raw=true"
                alt="CYin Logo"
                className="scale-50"
              />
            </div>
              <div>
                <h1 className="text-xl font-bold text-white">CYin</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={fetchCustomers}
                disabled={loading}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
                <span className="text-xs bg-slate-700 px-2 py-1 rounded">{user.role}</span>
              </div>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Refresh Message */}
      {refreshMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className={`p-3 rounded-lg ${refreshMessage.includes('success') ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
            <p className={`text-sm ${refreshMessage.includes('success') ? 'text-green-400' : 'text-red-400'}`}>
              {refreshMessage}
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Report Type Selector */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setActiveTab('individual')}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              activeTab === 'individual'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center space-x-4">
              <User className="w-8 h-8" />
              <div className="text-left">
                <h3 className="text-lg font-bold">Individual Report</h3>
                <p className="text-sm opacity-80">View detailed activity report for a specific customer</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('group')}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              activeTab === 'group'
                ? 'bg-blue-600 border-blue-500 text-white'
                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-800/70'
            }`}
          >
            <div className="flex items-center space-x-4">
              <Calendar className="w-8 h-8" />
              <div className="text-left">
                <h3 className="text-lg font-bold">Group Report</h3>
                <p className="text-sm opacity-80">View all customer activities for a specific date range</p>
              </div>
            </div>
          </button>
        </div>

        {/* Report Content */}
        <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-2xl p-6">
          {activeTab === 'individual' ? (
            <IndividualReport customers={customers} />
          ) : (
            <GroupReport />
          )}
        </div>
      </main>
    </div>
  );
};