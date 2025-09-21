import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DesignCoordinationProvider } from './features/designCoordination/context/DesignCoordinationContext';
import Layout from './components/Layout';
import Dashboard from './features/designCoordination/components/Dashboard';
import DocumentManager from './features/designCoordination/components/DocumentManager';
import RFIManager from './features/designCoordination/components/RFIManager';
import IssueTracker from './features/designCoordination/components/IssueTracker';
import './App.css';

function App() {
  return (
    <Router>
      <DesignCoordinationProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documents" element={<DocumentManager />} />
            <Route path="/rfis" element={<RFIManager />} />
            <Route path="/issues" element={<IssueTracker />} />
          </Routes>
        </Layout>
      </DesignCoordinationProvider>
    </Router>
  );
}

export default App;