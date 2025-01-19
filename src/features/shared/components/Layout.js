import React from 'react';
import Navigation from './Navigation';
import '../styles/theme.css';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Navigation />
      <main className="main-content">
        <div className="content-wrapper">
          {children}
        </div>
      </main>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Date Calculator Plus</p>
      </footer>
    </div>
  );
};

export default Layout; 