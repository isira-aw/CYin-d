import React from 'react';
import { useTheme } from './hooks/useTheme';
import { ReportingDashboard } from './components/ReportingDashboard';

function App() {
  // Initialize theme system
  useTheme();

  return <ReportingDashboard />;
}

export default App;