import React, { useState, useEffect } from 'react';
import { Customer } from '../types/api';
import { apiService } from '../services/api';
import { IndividualReport } from './IndividualReport';
import { DailyOverview } from './DailyOverview';
import { BarChart3, User, Calendar, Loader2, AlertCircle, RefreshCw } from 'lucide-react';

export const ReportingDashboard: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'individual' | 'daily'>('individual');

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const customerData = await apiService.getCustomers();
      setCustomers(customerData);
    } catch (err) {
      setError('Failed to load customers. Please check your connection and try again.');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const tabs = [
    {
      id: 'individual' as const,
      label: 'Individual Report',
      icon: User,
      description: 'View detailed activity report for a specific customer'
    },
    {
      id: 'daily' as const,
      label: 'Daily Overview',
      icon: Calendar,
      description: 'View all customer activities for a specific date'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-3 rounded-xl">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  Customer Reports Dashboard
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Track customer activities and generate comprehensive reports
                </p>
              </div>
            </div>
            
            <button
              onClick={fetchCustomers}
              disabled={loading}
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-700 dark:text-red-300">{error}</p>
            </div>
            <button
              onClick={fetchCustomers}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading customers...</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {!loading && !error && (
          <>
            {/* Tab Navigation */}
            <div className="mb-8">
              <div className="bg-white dark:bg-slate-800 rounded-xl p-2 border border-slate-200 dark:border-slate-700">
                <div className="flex space-x-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center space-x-3 px-6 py-4 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <div className="text-left">
                        <div className="font-semibold">{tab.label}</div>
                        <div className="text-xs opacity-75 hidden sm:block">
                          {tab.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="transition-all duration-300">
              {activeTab === 'individual' && (
                <IndividualReport customers={customers} loading={loading} />
              )}
              {activeTab === 'daily' && (
                <DailyOverview customers={customers} loading={loading} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};