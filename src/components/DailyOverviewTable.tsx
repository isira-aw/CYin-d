import React from 'react';
import { CustomerReport } from '../types/api';
import { Users, Activity, MapPin } from 'lucide-react';

interface DailyOverviewTableProps {
  reports: CustomerReport[];
  selectedDate: string;
}

export const DailyOverviewTable: React.FC<DailyOverviewTableProps> = ({ 
  reports, 
  selectedDate 
}) => {
  if (!reports || reports.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No reports found for {selectedDate}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Daily Overview - {selectedDate}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {reports.length} customer{reports.length !== 1 ? 's' : ''} with activity
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Customer
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Role
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Description
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                <Activity className="w-4 h-4 inline mr-2" />
                Activities
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                Latest Activity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {reports.map((report, index) => {
              const latestActivity = report.activities && report.activities.length > 0 
                ? report.activities[report.activities.length - 1] 
                : null;
              
              return (
                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900 dark:text-white">
                      {report.customerName || 'Unknown Customer'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      {report.role || 'No role'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">
                    {report.description || 'No description'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                    <span className="font-semibold">
                      {report.activities ? report.activities.length : 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                    {latestActivity ? (
                      <div className="space-y-1">
                        <div className="font-mono text-xs">
                          {latestActivity.time}
                        </div>
                        {latestActivity.location && (
                          <div className="flex items-center text-xs">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-24">
                              {latestActivity.location}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-slate-400">No activities</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};