export interface Customer {
  id: number;
  customerName: string;
  email: string;
  role: string;
  password: string;
}

export interface Activity {
  time: string;
  date: string;
  location: string;
  status: string;
}

export interface CustomerReport {
  customerName: string;
  role: string;
  description: string;
    reportDate: string;
  activities: Activity[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface DailyOverviewTableProps {
  reports: CustomerReport[];
  selectedDate: string;
  onExportPDF: (report: CustomerReport) => void;
}
