import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './features/shared/components/Layout';
import HolidayLookup from './features/holidays/components/HolidayLookup';
import CalculatorForm from './features/calculator/components/CalculatorForm';
import './features/shared/styles/theme.css';
import './features/holidays/styles/holidays.css';
import './features/calculator/styles/calculator.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/calculator" element={<CalculatorForm />} />
          <Route path="/holidays" element={<HolidayLookup />} />
          <Route path="/" element={
            <div className="welcome-content">
              <h2>Welcome to Date Calculator Plus</h2>
              <p>A powerful tool for calculating working days across different countries.</p>
              <div className="welcome-actions">
                <a href="/calculator" className="welcome-button">Calculate Working Days</a>
                <a href="/holidays" className="welcome-button">View Holidays</a>
              </div>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 