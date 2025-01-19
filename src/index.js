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
              <p>Select a feature from the navigation menu to get started.</p>
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />); 