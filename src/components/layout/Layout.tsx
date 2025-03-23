import React, { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Navigation items for the sidebar
  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Date Calculator', path: '/date-calculator', icon: '🗓️' },
    { name: 'Date Adder', path: '/date-adder', icon: '➕' },
    { name: 'Timezone Converter', path: '/timezone-converter', icon: '🌐' },
    { name: 'Holiday Calculator', path: '/holiday-calculator', icon: '🎉' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <div className="flex items-center">
            <span className="text-2xl">⏰</span>
            <span className="ml-2 text-lg font-semibold text-gray-800">DateCalculatorPlus</span>
          </div>
          <button 
            className="md:hidden p-2 rounded-md hover:bg-gray-100" 
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        
        {/* Sidebar content */}
        <div className="py-4 px-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="flex items-center px-4 py-3 text-gray-700 rounded-md hover:bg-blue-50 hover:text-blue-700"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3 text-xl">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button 
              className="p-2 rounded-md hover:bg-gray-100 md:hidden" 
              onClick={() => setSidebarOpen(true)}
            >
              ≡
            </button>
            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-800">Date Calculator Plus</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-md hover:bg-gray-100">
                <span className="sr-only">Notifications</span>
                🔔
              </button>
              <button className="p-2 rounded-md hover:bg-gray-100">
                <span className="sr-only">User menu</span>
                👤
              </button>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 p-4">
          <div className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DateCalculatorPlus. All rights reserved.
          </div>
        </footer>
      </div>
      
      {/* Overlay to close sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}; 