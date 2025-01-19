import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/" className="nav-brand-link">
          <h1>Date Calculator Plus</h1>
        </Link>
      </div>
      <ul className="nav-links">
        <li>
          <Link 
            to="/calculator" 
            className={`nav-link ${location.pathname === '/calculator' ? 'active' : ''}`}
          >
            Calculator
          </Link>
        </li>
        <li>
          <Link 
            to="/holidays" 
            className={`nav-link ${location.pathname === '/holidays' ? 'active' : ''}`}
          >
            Holiday Lookup
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 