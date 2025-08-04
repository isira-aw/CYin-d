import React, { useState, useEffect } from "react";
import { MapPin, User, Calendar, Download, Clock, Timer, X, AlertCircle } from "lucide-react";

// --- Types ---
interface Customer {
  id: string;
  email: string;
  customerName: string;
}

interface EventDetail {
  date: string;
  location: string;
  time: string;
  status: string;
}

interface ReportData {
  customerName: string;
  email: string;
  role: string;
  reportPeriod: string;
  eventDetails: EventDetail[];
}

// --- Location Fetch Function ---
const getAddressFromCoordinates = async (latitude: string, longitude: string): Promise<string> => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch address');
    
    const data = await response.json();
    const address = data.address || {};
    const road = address.road || "";
    const city = address.city || address.town || address.village || "";
    const district = address.district || "";
    return `${road}${road && (city || district) ? ', ' : ''}${city}${city && district ? ', ' : ''}${district}`.trim() || "Location not found";
  } catch (error) {
    console.error("Error fetching address:", error);
    return "Location not found";
  }
};

// Validate coordinates
const isValidCoordinate = (coord: string): boolean => {
  const num = parseFloat(coord);
  return !isNaN(num) && isFinite(num);
};

// --- Modal Component ---
const Modal: React.FC<{ onClose: () => void; children: React.ReactNode }> = ({ onClose, children }) => {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 border border-slate-600 rounded-xl relative max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 z-10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        {children}
      </div>
    </div>
  );
};

// --- Simple Map Component (Placeholder) ---
const SimpleMap: React.FC<{ latitude: number; longitude: number; address: string }> = ({ latitude, longitude, address }) => {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold text-white mb-4">Location Details</h3>
      <div className="space-y-4">
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Address:</span>
              <p className="text-white font-medium">{address}</p>
            </div>
            <div>
              <span className="text-slate-400">Coordinates:</span>
              <p className="text-white font-medium">{latitude.toFixed(6)}, {longitude.toFixed(6)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={openInGoogleMaps}
            className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <MapPin className="w-4 h-4" />
            <span>Open in Google Maps</span>
          </button>
          
          <button
            onClick={() => navigator.clipboard.writeText(`${latitude}, ${longitude}`)}
            className="flex items-center justify-center space-x-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <span>Copy Coordinates</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Event Location Component ---
const EventLocation: React.FC<{ event: EventDetail }> = ({ event }) => {
  const [address, setAddress] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [showMap, setShowMap] = useState<boolean>(false);

  useEffect(() => {
    const getLocation = async () => {
      if (!event.location) {
        setError("No location data available");
        setLoading(false);
        return;
      }

      const coordinates = event.location.split(", ");
      if (coordinates.length !== 2) {
        setError("Invalid location format");
        setLoading(false);
        return;
      }

      const [latitude, longitude] = coordinates;
      if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
        setError("Invalid coordinates");
        setLoading(false);
        return;
      }

      try {
        const location = await getAddressFromCoordinates(latitude, longitude);
        setAddress(location);
      } catch (err) {
          console.error(err);  // Log the error
        setError("Failed to fetch address");
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, [event.location]);

  const openMap = () => {
    if (!error && address && address !== "Location not found") {
      setShowMap(true);
    }
  };

  const closeMap = () => {
    setShowMap(false);
  };

  if (loading) {
    return (
      <div>
        <span className="text-slate-400">Location:</span>
        <p className="text-slate-300">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <span className="text-slate-400">Location:</span>
        <p className="text-red-400 flex items-center space-x-1">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </p>
      </div>
    );
  }

  const coordinates = event.location.split(", ");
  const latitude = parseFloat(coordinates[0]);
  const longitude = parseFloat(coordinates[1]);

  return (
    <div>
      <span className="text-slate-400">Location:</span>
      <p className="text-white font-medium mb-2">{address}</p>
      
      <button
        onClick={openMap}
        disabled={address === "Location not found"}
        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-3 py-1 rounded-lg text-sm transition-colors"
      >
        <MapPin className="w-4 h-4" />
        <span>View Details</span>
      </button>

      {showMap && (
        <Modal onClose={closeMap}>
          <SimpleMap latitude={latitude} longitude={longitude} address={address} />
        </Modal>
      )}
    </div>
  );
};

// --- Main Component ---
export const IndividualReport: React.FC<{ customers: Customer[] }> = ({ customers = [] }) => {
  const [selectedEmail, setSelectedEmail] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const validateForm = (): boolean => {
    if (!selectedEmail || !startDate || !endDate) {
      setError('Please fill in all fields');
      return false;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before end date');
      return false;
    }

    return true;
  };

  const generateReport = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setReportData(null);

    try {
      const response = await fetch("https://cyin-production.up.railway.app/api/report/generate-user-report-json", {
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Report generation error:', error);
      setError('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!validateForm()) return;

    const url = `https://cyin-production.up.railway.app/api/report/generate-report?email=${encodeURIComponent(selectedEmail)}&startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`;
    window.open(url, '_blank');
  };

  const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'starting working':
        return 'bg-green-500/20 text-green-400';
      case 'ending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'moving':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-red-500/20 text-red-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <User className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Individual Customer Report</h1>
            <p className="text-slate-400">Generate detailed reports for individual customers</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Select Customer *
              </label>
              <select
                value={selectedEmail}
                onChange={(e) => setSelectedEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                Start Date *
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
                End Date *
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
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={generateReport}
              disabled={loading}
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
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
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
              <p className="text-slate-300">Generating report...</p>
            </div>
          </div>
        )}

        {/* Report Data */}
        {reportData && (
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-6">
            {/* Report Summary */}
            <div className="border-b border-slate-700 pb-6">
              <h3 className="text-2xl font-bold text-white mb-4">Report Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <span className="text-slate-400 text-sm">Customer</span>
                  <p className="text-white font-semibold text-lg">{reportData.customerName}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <span className="text-slate-400 text-sm">Email</span>
                  <p className="text-white font-semibold">{reportData.email}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <span className="text-slate-400 text-sm">Role</span>
                  <p className="text-white font-semibold">{reportData.role}</p>
                </div>
                <div className="bg-slate-700/30 rounded-lg p-4">
                  <span className="text-slate-400 text-sm">Period</span>
                  <p className="text-white font-semibold">{reportData.reportPeriod}</p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                <Clock className="w-6 h-6 text-blue-400" />
                <span>Event Details</span>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-sm">
                  {reportData.eventDetails.length} events
                </span>
              </h4>

              {reportData.eventDetails.length > 0 ? (
                <div className="space-y-4">
                  {reportData.eventDetails.map((event, index) => (
                    <div key={index} className="bg-slate-700/30 border border-slate-600 rounded-lg p-5 hover:bg-slate-700/40 transition-colors">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start space-x-3">
                          <Calendar className="w-5 h-5 text-blue-400 mt-0.5" />
                          <div>
                            <span className="text-slate-400 text-sm">Date</span>
                            <p className="text-white font-medium">{event.date}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-5 h-5 text-green-400 mt-0.5" />
                          <div className="min-w-0 flex-1">
                            <EventLocation event={event} />
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Timer className="w-5 h-5 text-purple-400 mt-0.5" />
                          <div>
                            <span className="text-slate-400 text-sm">Time</span>
                            <p className="text-white font-medium">{event.time}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-slate-400 text-sm">Status</span>
                          <div className="mt-1">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                              {event.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg">No events found for the selected period</p>
                  <p className="text-slate-500">Try adjusting your date range</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};