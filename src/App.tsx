import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import './App.css';
import { LogisticsProvider } from './features/logistics/context/LogisticsContext';
import LogisticsDashboard from './features/logistics/components/LogisticsDashboard/LogisticsDashboard';
import DeliveryScheduler from './features/logistics/components/DeliveryScheduler/DeliveryScheduler';
import MIRForm from './features/logistics/components/MIRForm/MIRForm';
import IRForm from './features/logistics/components/IRForm/IRForm';
import InspectionList from './features/logistics/components/InspectionList/InspectionList';

function App() {
  return (
    <LogisticsProvider>
      <Router>
        <div className="app">
          <header className="app-header">
            <h1>Site Daily Operations - Logistics Management</h1>
            <nav className="app-nav">
              <NavLink to="/" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Dashboard
              </NavLink>
              <NavLink to="/deliveries" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Deliveries
              </NavLink>
              <NavLink to="/mir" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Material Inspections
              </NavLink>
              <NavLink to="/ir" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                Inspection Reports
              </NavLink>
              <NavLink to="/inspections" className={({isActive}) => isActive ? 'nav-link active' : 'nav-link'}>
                All Inspections
              </NavLink>
            </nav>
          </header>
          
          <main className="app-main">
            <Routes>
              <Route path="/" element={<LogisticsDashboard />} />
              <Route path="/deliveries" element={<DeliveryScheduler />} />
              <Route path="/mir" element={<MIRForm />} />
              <Route path="/ir" element={<IRForm type="quality" />} />
              <Route path="/inspections" element={<InspectionList />} />
            </Routes>
          </main>
        </div>
      </Router>
    </LogisticsProvider>
  );
}

export default App;