import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatDate } from '../../lib/date';
import { getNextHoliday } from '../../lib/date/holidays';

/**
 * Dashboard component - the main landing page of the application
 */
export const Dashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextHoliday, setNextHoliday] = useState<{
    date: Date;
    name: string;
    daysAway: number;
  } | null>(null);
  
  // Update the current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Get the next holiday on component mount
  useEffect(() => {
    fetchNextHoliday();
  }, []);
  
  // Function to fetch the next holiday
  const fetchNextHoliday = async () => {
    try {
      const holidayData = await getNextHoliday();
      if (holidayData) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const daysAway = Math.ceil(
          (holidayData.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        setNextHoliday({
          ...holidayData,
          daysAway,
        });
      }
    } catch (err) {
      console.error('Error fetching next holiday:', err);
    }
  };
  
  // Sample recent calculations
  const recentCalculations = [
    {
      id: 1,
      type: 'Date Difference',
      description: 'Project Deadline - Start Date',
      result: '45 working days',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
      id: 2,
      type: 'Date Add',
      description: 'Shipping Arrival Estimation',
      result: 'October 15, 2023',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: 3,
      type: 'Timezone Conversion',
      description: 'Meeting Time Conversion',
      result: 'Tokyo: 9:00 AM, New York: 8:00 PM',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
    },
  ];
  
  // Quick access tools
  const quickTools = [
    {
      name: 'Date Calculator',
      description: 'Calculate the difference between two dates',
      icon: '🗓️',
      path: '/date-calculator',
      color: 'bg-blue-50 text-blue-700',
    },
    {
      name: 'Date Adder',
      description: 'Add or subtract time from a date',
      icon: '➕',
      path: '/date-adder',
      color: 'bg-green-50 text-green-700',
    },
    {
      name: 'Timezone Converter',
      description: 'Convert times between different timezones',
      icon: '🌐',
      path: '/timezone-converter',
      color: 'bg-purple-50 text-purple-700',
    },
    {
      name: 'Holiday Calculator',
      description: 'Check if a date is a holiday',
      icon: '🎉',
      path: '/holiday-calculator',
      color: 'bg-red-50 text-red-700',
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Welcome section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome to DateCalculatorPlus
        </h1>
        <p className="text-blue-100 mb-4">
          Your comprehensive solution for all date-related calculations
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-2">Current Date & Time</h2>
            <div className="text-2xl font-bold">
              {formatDate(currentTime, 'MMMM d, yyyy')}
            </div>
            <div className="text-xl">
              {formatDate(currentTime, 'h:mm:ss a')}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg backdrop-filter backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-2">Next Holiday</h2>
            {nextHoliday ? (
              <div>
                <div className="text-2xl font-bold">{nextHoliday.name}</div>
                <div>
                  {formatDate(nextHoliday.date, 'MMMM d, yyyy')}
                  <span className="ml-2 bg-white bg-opacity-30 rounded-full px-2 py-0.5 text-sm">
                    {nextHoliday.daysAway === 0
                      ? 'Today!'
                      : nextHoliday.daysAway === 1
                      ? 'Tomorrow!'
                      : `In ${nextHoliday.daysAway} days`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-lg">Loading...</div>
            )}
          </div>
        </div>
      </div>
      
      {/* Quick access tools */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Quick Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickTools.map((tool) => (
            <Link
              key={tool.path}
              to={tool.path}
              className="block group"
            >
              <Card className="h-full transition-transform transform group-hover:-translate-y-1">
                <div className="flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-lg ${tool.color} flex items-center justify-center text-2xl mb-4`}>
                    {tool.icon}
                  </div>
                  <h3 className="text-lg font-medium mb-2">{tool.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{tool.description}</p>
                  <div className="mt-auto">
                    <Button variant="light" size="sm" className="w-full">
                      Open
                    </Button>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
      
      {/* Recent calculations */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Calculations</h2>
          <Button variant="light" size="sm">
            View All
          </Button>
        </div>
        <Card>
          {recentCalculations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {recentCalculations.map((calc) => (
                <li key={calc.id} className="py-4 px-4 flex justify-between hover:bg-gray-50">
                  <div>
                    <span className="block font-medium">{calc.description}</span>
                    <span className="block text-sm text-gray-500">
                      {calc.type} • {calc.result}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatRelativeTime(calc.timestamp)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-4 px-4 text-gray-500 text-center">
              No recent calculations found. Start using the tools to see your history here.
            </p>
          )}
        </Card>
      </section>
      
      {/* Tips & Tricks */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tips & Tricks</h2>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            💡 Did you know?
          </h3>
          <p className="text-yellow-700">
            When calculating workdays, you can exclude both weekends and holidays 
            from specific regions. This is useful for project planning across 
            different countries.
          </p>
        </div>
      </section>
    </div>
  );
};

/**
 * Format a timestamp as a relative time string (e.g. "2 hours ago")
 */
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return formatDate(date, 'MMM d, yyyy');
  }
} 