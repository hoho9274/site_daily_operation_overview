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
    { name: 'Quality & EHS', href: '/quality-ehs', icon: '🛡️' },
    { name: 'Schedule Health', href: '/schedule', icon: '📅' },
    { name: 'Field Kanban', href: '/kanban', icon: '📋' },
    { name: 'Logistics', href: '/logistics', icon: '🚚' },
    { name: 'Meetings', href: '/meetings', icon: '👥' },
    { name: 'Cost Snapshot', href: '/cost', icon: '💰' },
    { name: 'Reports', href: '/reports', icon: '📈' },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <h1 className="logo">🏗️ Site Daily Operations</h1>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">John Doe</span>
              <span className="user-role">Site Manager</span>
            </div>
          </div>
        </div>
      </header>

      <div className="layout-content">
        <aside className="sidebar">
          <nav className="nav">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`nav-item ${
                  location.pathname === item.href ? 'nav-item-active' : ''
                }`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-text">{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          <div className="content-wrapper">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;