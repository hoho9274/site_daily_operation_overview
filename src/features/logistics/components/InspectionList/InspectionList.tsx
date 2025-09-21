import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import './InspectionList.css';

const InspectionList: React.FC = () => {
  const { mirs, irs, loading } = useLogistics();
  const [activeTab, setActiveTab] = useState<'mir' | 'ir'>('mir');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter MIRs
  const filteredMIRs = mirs.filter(mir => {
    const matchesStatus = filterStatus === 'all' || mir.overallStatus === filterStatus;
    const matchesSearch = mir.mirNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mir.inspector.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          mir.materials.some(m => m.materialName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  // Filter IRs
  const filteredIRs = irs.filter(ir => {
    const matchesStatus = filterStatus === 'all' || ir.status === filterStatus;
    const matchesSearch = ir.irNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ir.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ir.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ir.inspector.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="inspection-list-loading">
        <div className="spinner"></div>
        <p>Loading inspections...</p>
      </div>
    );
  }

  return (
    <div className="inspection-list-container">
      <h2>All Inspections</h2>

      <div className="inspection-controls">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'mir' ? 'active' : ''}`}
            onClick={() => setActiveTab('mir')}
          >
            Material Inspections ({mirs.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'ir' ? 'active' : ''}`}
            onClick={() => setActiveTab('ir')}
          >
            Inspection Reports ({irs.length})
          </button>
        </div>

        <div className="filter-controls">
          <input
            type="text"
            className="form-control search-input"
            placeholder="Search inspections..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-control form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            {activeTab === 'mir' ? (
              <>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="conditional">Conditional</option>
              </>
            ) : (
              <>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
                <option value="pending">Pending</option>
              </>
            )}
          </select>
        </div>
      </div>

      {activeTab === 'mir' ? (
        <div className="mir-grid">
          {filteredMIRs.length === 0 ? (
            <div className="empty-state">
              <p>No material inspections found matching your criteria.</p>
            </div>
          ) : (
            filteredMIRs.map(mir => (
              <div key={mir.id} className="inspection-card mir-card">
                <div className="inspection-header">
                  <div className="inspection-title">
                    <h3>{mir.mirNumber}</h3>
                    <span className={`status-badge status-${mir.overallStatus}`}>
                      {mir.overallStatus}
                    </span>
                  </div>
                  <div className="inspection-date">
                    {new Date(mir.inspectionDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="inspection-body">
                  <div className="inspection-detail">
                    <strong>Inspector:</strong> {mir.inspector.name}
                  </div>
                  {mir.deliveryId && (
                    <div className="inspection-detail">
                      <strong>Delivery:</strong> {mir.deliveryId}
                    </div>
                  )}
                  
                  <div className="materials-section">
                    <strong>Materials Inspected ({mir.materials.length}):</strong>
                    <div className="materials-tags">
                      {mir.materials.map((material, idx) => (
                        <span key={idx} className={`material-tag tag-${material.status}`}>
                          {material.materialName} ({material.quantity} {material.unit})
                          <span className={`status-indicator status-${material.status}`}>
                            {material.status === 'passed' ? '✓' : 
                             material.status === 'failed' ? '✗' : '!'}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {mir.nonConformances.length > 0 && (
                    <div className="non-conformances-section">
                      <strong className="nc-title">
                        ⚠️ Non-Conformances ({mir.nonConformances.length}):
                      </strong>
                      <ul className="nc-list">
                        {mir.nonConformances.map((nc, idx) => (
                          <li key={idx} className={`nc-item severity-${nc.severity}`}>
                            <span className="nc-severity">[{nc.severity.toUpperCase()}]</span>
                            {nc.description}
                            {nc.status === 'open' && <span className="nc-open"> - OPEN</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {mir.signature && (
                    <div className="signature-section">
                      <strong>Signed by:</strong> {mir.signature}
                    </div>
                  )}
                </div>

                <div className="inspection-footer">
                  <span className="timestamp">
                    Created: {new Date(mir.createdAt).toLocaleString()}
                  </span>
                  <span className="timestamp">
                    Updated: {new Date(mir.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="ir-grid">
          {filteredIRs.length === 0 ? (
            <div className="empty-state">
              <p>No inspection reports found matching your criteria.</p>
            </div>
          ) : (
            filteredIRs.map(ir => (
              <div key={ir.id} className="inspection-card ir-card">
                <div className="inspection-header">
                  <div className="inspection-title">
                    <h3>{ir.irNumber}</h3>
                    <span className={`type-badge type-${ir.type}`}>
                      {ir.type}
                    </span>
                    <span className={`status-badge status-${ir.status}`}>
                      {ir.status}
                    </span>
                  </div>
                  <div className="inspection-date">
                    {new Date(ir.inspectionDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="inspection-body">
                  <div className="inspection-detail">
                    <strong>Location:</strong> {ir.location}
                  </div>
                  <div className="inspection-detail">
                    <strong>Inspector:</strong> {ir.inspector.name}
                  </div>

                  <div className="findings-section">
                    <strong>Findings ({ir.findings.length}):</strong>
                    <div className="findings-summary">
                      {ir.findings.map((finding, idx) => (
                        <div key={idx} className="finding-summary">
                          <span className={`severity-indicator severity-${finding.severity}`}>
                            {finding.severity === 'critical' ? '⚠️' : 
                             finding.severity === 'major' ? '⚡' : 'ℹ️'}
                          </span>
                          <span className="finding-category">{finding.category}:</span>
                          <span className="finding-desc">
                            {finding.description.length > 100 
                              ? finding.description.substring(0, 100) + '...'
                              : finding.description}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {ir.correctiveActions.length > 0 && (
                    <div className="corrective-actions-section">
                      <strong>Corrective Actions ({ir.correctiveActions.length}):</strong>
                      <div className="actions-summary">
                        <span className="action-stat">
                          ✓ Completed: {ir.correctiveActions.filter(ca => ca.status === 'completed').length}
                        </span>
                        <span className="action-stat">
                          ⏳ In Progress: {ir.correctiveActions.filter(ca => ca.status === 'in-progress').length}
                        </span>
                        <span className="action-stat">
                          ⏸ Pending: {ir.correctiveActions.filter(ca => ca.status === 'pending').length}
                        </span>
                      </div>
                      <ul className="actions-list-summary">
                        {ir.correctiveActions.slice(0, 3).map((action, idx) => (
                          <li key={idx} className={`action-summary status-${action.status}`}>
                            <span className="action-responsible">{action.responsiblePerson}:</span>
                            {action.action.length > 80 
                              ? action.action.substring(0, 80) + '...'
                              : action.action}
                            <span className="action-due">
                              (Due: {new Date(action.dueDate).toLocaleDateString()})
                            </span>
                          </li>
                        ))}
                        {ir.correctiveActions.length > 3 && (
                          <li className="more-actions">
                            ...and {ir.correctiveActions.length - 3} more action(s)
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  {ir.followUpDate && (
                    <div className="follow-up-section">
                      <strong>Follow-up Date:</strong> {new Date(ir.followUpDate).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="inspection-footer">
                  <span className="timestamp">
                    Created: {new Date(ir.createdAt).toLocaleString()}
                  </span>
                  <span className="timestamp">
                    Updated: {new Date(ir.updatedAt).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionList;