import React, { useEffect, useState } from 'react';

interface ActivityLog {
  id: number;
  action: string;
  timestamp: string; // You might want to use a Date type here and format it
}

const ActivityLogPage: React.FC = () => {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      try {
        const response = await fetch('/api/activity-log');
        if (!response.ok) {
          throw new Error(`Error fetching activity logs: ${response.statusText}`);
        }
        const data: ActivityLog[] = await response.json();
        setActivityLogs(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivityLogs();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Activity Log</h1>
      {loading ? (
        <p>Loading activity log...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : activityLogs.length === 0 ? (
        <p>No activity recorded.</p>
      ) : (
        <ul className="space-y-2">
          {activityLogs.map((log) => (
            <li key={log.id} className="border rounded p-3 shadow-sm">
              <p className="text-gray-700">
                <strong className="font-semibold">Action:</strong> {log.action}
              </p>
              {/* You might want to format the timestamp */}
              <p className="text-sm text-gray-500">
                <strong className="font-semibold">Timestamp:</strong> {log.timestamp}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLogPage;