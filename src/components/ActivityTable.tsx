import React from 'react';
import { Activity } from '../types/api';
import { Clock, MapPin, Activity as ActivityIcon } from 'lucide-react';

interface ActivityTableProps {
  activities: Activity[];
  customerName?: string;
}

export const ActivityTable: React.FC<ActivityTableProps> = ({ 
  activities, 
  customerName 
}) => {
  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400">
        <ActivityIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>No activities found for this date</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      {customerName && (
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Activities for {customerName}
          </h3>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                <Clock className="w-4 h-4 inline mr-2" />
                Time
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                <ActivityIcon className="w-4 h-4 inline mr-2" />
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {activities.map((activity, index) => (
              <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-mono">
                  {activity.time || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                  {activity.location || 'No location'}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                    activity.status 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {activity.status || 'No status'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};