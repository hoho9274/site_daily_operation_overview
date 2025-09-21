import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { name: 'Documents', href: '/documents', icon: '📁' },
    { name: 'RFIs', href: '/rfis', icon: '❓' },
    { name: 'Issues', href: '/issues', icon: '⚠️' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">🏗️ Site Daily Operations</h1>
          </div>
          <div className="header-right">
            <span className="user-info">Project: Construction Site Alpha</span>
            <button className="user-menu">
              <span>👤 John Doe</span>
            </button>
          </div>
        </div>
      </header>

      <div className="layout-body">
        <nav className="sidebar">
          <div className="sidebar-header">
            <h2>Design Coordination</h2>
          </div>
          <ul className="nav-list">
            {navigation.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className={`nav-link ${
                    location.pathname === item.href ? 'active' : ''
                  }`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-text">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <main className="main-content">
          <div className="content-wrapper">{children}</div>
        </main>
      </div>

      <footer className="footer">
        <div className="footer-container">
          <p>&copy; 2025 Site Daily Operation Overview. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;