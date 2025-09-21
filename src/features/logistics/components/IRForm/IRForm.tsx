import React, { useState } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { IR, Finding, CorrectiveAction } from '../../types/logistics.types';
import './IRForm.css';

interface IRFormProps {
  type?: 'quality' | 'safety' | 'environmental';
}

const IRForm: React.FC<IRFormProps> = ({ type = 'quality' }) => {
  const { irs, createIR, loading } = useLogistics();
  
  // Form state
  const [formData, setFormData] = useState({
    type: type,
    inspectionDate: new Date().toISOString().split('T')[0],
    location: '',
    findings: [] as Finding[],
    correctiveActions: [] as CorrectiveAction[],
    followUpDate: '',
    signature: '',
  });

  const [currentFinding, setCurrentFinding] = useState({
    description: '',
    severity: 'minor' as Finding['severity'],
    category: '',
  });

  const [currentAction, setCurrentAction] = useState({
    findingId: '',
    action: '',
    responsiblePerson: '',
    dueDate: '',
    status: 'pending' as CorrectiveAction['status'],
  });

  const [showFindingForm, setShowFindingForm] = useState(false);
  const [showActionForm, setShowActionForm] = useState(false);

  const getCategoryOptions = () => {
    switch(formData.type) {
      case 'safety':
        return ['PPE Compliance', 'Emergency Access', 'Equipment Safety', 'Work Procedures', 'Hazard Control'];
      case 'environmental':
        return ['Erosion Control', 'Waste Management', 'Air Quality', 'Water Quality', 'Noise Control'];
      case 'quality':
      default:
        return ['Structural', 'Finishing', 'Materials', 'Workmanship', 'Documentation'];
    }
  };

  const addFinding = () => {
    if (!currentFinding.description || !currentFinding.category) {
      alert('Please provide description and category for the finding');
      return;
    }

    const newFinding: Finding = {
      id: `finding-${Date.now()}`,
      ...currentFinding,
      photos: [],
    };

    setFormData({
      ...formData,
      findings: [...formData.findings, newFinding],
    });

    setCurrentFinding({
      description: '',
      severity: 'minor',
      category: '',
    });
    setShowFindingForm(false);
  };

  const removeFinding = (id: string) => {
    setFormData({
      ...formData,
      findings: formData.findings.filter(f => f.id !== id),
      // Also remove related corrective actions
      correctiveActions: formData.correctiveActions.filter(ca => ca.findingId !== id),
    });
  };

  const addCorrectiveAction = () => {
    if (!currentAction.action || !currentAction.responsiblePerson || !currentAction.findingId) {
      alert('Please fill all required fields for corrective action');
      return;
    }

    const newAction: CorrectiveAction = {
      id: `action-${Date.now()}`,
      ...currentAction,
      dueDate: new Date(currentAction.dueDate),
    };

    setFormData({
      ...formData,
      correctiveActions: [...formData.correctiveActions, newAction],
    });

    setCurrentAction({
      findingId: '',
      action: '',
      responsiblePerson: '',
      dueDate: '',
      status: 'pending',
    });
    setShowActionForm(false);
  };

  const removeCorrectiveAction = (id: string) => {
    setFormData({
      ...formData,
      correctiveActions: formData.correctiveActions.filter(ca => ca.id !== id),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.findings.length === 0) {
      alert('Please add at least one finding');
      return;
    }

    if (!formData.location || !formData.signature) {
      alert('Please fill all required fields');
      return;
    }

    // Determine status based on corrective actions
    const hasOpenActions = formData.correctiveActions.some(ca => ca.status !== 'completed');
    const status = formData.correctiveActions.length === 0 ? 'pending' : 
                   hasOpenActions ? 'open' : 'closed';

    const irData: Omit<IR, 'id' | 'createdAt' | 'updatedAt'> = {
      irNumber: `IR-${new Date().getFullYear()}-${String(irs.length + 1).padStart(3, '0')}`,
      type: formData.type,
      inspectionDate: new Date(formData.inspectionDate),
      inspector: {
        id: 'current-user',
        name: formData.signature,
        email: 'inspector@company.com',
        role: `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Inspector`,
      },
      location: formData.location,
      findings: formData.findings,
      correctiveActions: formData.correctiveActions,
      status,
      followUpDate: formData.followUpDate ? new Date(formData.followUpDate) : undefined,
      photos: [],
    };

    try {
      await createIR(irData);
      alert('Inspection Report created successfully!');
      // Reset form
      setFormData({
        type: type,
        inspectionDate: new Date().toISOString().split('T')[0],
        location: '',
        findings: [],
        correctiveActions: [],
        followUpDate: '',
        signature: '',
      });
    } catch (error) {
      console.error('Error creating IR:', error);
      alert('Failed to create IR');
    }
  };

  return (
    <div className="ir-form-container">
      <h2>Inspection Report (IR) - {formData.type.charAt(0).toUpperCase() + formData.type.slice(1)}</h2>
      
      <form onSubmit={handleSubmit} className="ir-form card">
        <div className="form-section">
          <h3>Inspection Details</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Inspection Type *</label>
              <select
                className="form-control form-select"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value as IR['type']})}
              >
                <option value="quality">Quality</option>
                <option value="safety">Safety</option>
                <option value="environmental">Environmental</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Inspection Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.inspectionDate}
                onChange={(e) => setFormData({...formData, inspectionDate: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                className="form-control"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Site location or area..."
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Findings</h3>
            <button 
              type="button" 
              className="btn btn-sm btn-warning"
              onClick={() => setShowFindingForm(!showFindingForm)}
            >
              {showFindingForm ? 'Cancel' : '+ Add Finding'}
            </button>
          </div>

          {showFindingForm && (
            <div className="finding-form">
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={currentFinding.description}
                  onChange={(e) => setCurrentFinding({...currentFinding, description: e.target.value})}
                  placeholder="Describe the finding in detail..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category *</label>
                  <select
                    className="form-control form-select"
                    value={currentFinding.category}
                    onChange={(e) => setCurrentFinding({...currentFinding, category: e.target.value})}
                  >
                    <option value="">Select category...</option>
                    {getCategoryOptions().map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Severity *</label>
                  <select
                    className="form-control form-select"
                    value={currentFinding.severity}
                    onChange={(e) => setCurrentFinding({
                      ...currentFinding, 
                      severity: e.target.value as Finding['severity']
                    })}
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>
              <button type="button" className="btn btn-warning" onClick={addFinding}>
                Add Finding
              </button>
            </div>
          )}

          {formData.findings.length > 0 && (
            <div className="findings-list">
              {formData.findings.map((finding) => (
                <div key={finding.id} className="finding-item">
                  <div className="finding-info">
                    <div className="finding-header">
                      <span className={`severity-badge severity-${finding.severity}`}>
                        {finding.severity}
                      </span>
                      <span className="finding-category">{finding.category}</span>
                    </div>
                    <p className="finding-description">{finding.description}</p>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => removeFinding(finding.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <div className="section-header">
            <h3>Corrective Actions</h3>
            <button 
              type="button" 
              className="btn btn-sm btn-success"
              onClick={() => setShowActionForm(!showActionForm)}
              disabled={formData.findings.length === 0}
            >
              {showActionForm ? 'Cancel' : '+ Add Corrective Action'}
            </button>
          </div>

          {showActionForm && (
            <div className="action-form">
              <div className="form-group">
                <label className="form-label">Related Finding *</label>
                <select
                  className="form-control form-select"
                  value={currentAction.findingId}
                  onChange={(e) => setCurrentAction({...currentAction, findingId: e.target.value})}
                >
                  <option value="">Select finding...</option>
                  {formData.findings.map(finding => (
                    <option key={finding.id} value={finding.id}>
                      {finding.category}: {finding.description.substring(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Action Required *</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={currentAction.action}
                  onChange={(e) => setCurrentAction({...currentAction, action: e.target.value})}
                  placeholder="Describe the corrective action..."
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Responsible Person *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentAction.responsiblePerson}
                    onChange={(e) => setCurrentAction({...currentAction, responsiblePerson: e.target.value})}
                    placeholder="Name or role..."
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={currentAction.dueDate}
                    onChange={(e) => setCurrentAction({...currentAction, dueDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control form-select"
                    value={currentAction.status}
                    onChange={(e) => setCurrentAction({
                      ...currentAction, 
                      status: e.target.value as CorrectiveAction['status']
                    })}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <button type="button" className="btn btn-success" onClick={addCorrectiveAction}>
                Add Corrective Action
              </button>
            </div>
          )}

          {formData.correctiveActions.length > 0 && (
            <div className="actions-list">
              {formData.correctiveActions.map((action) => {
                const finding = formData.findings.find(f => f.id === action.findingId);
                return (
                  <div key={action.id} className="action-item">
                    <div className="action-info">
                      <div className="action-header">
                        <span className="action-finding">
                          Finding: {finding?.category}
                        </span>
                        <span className={`status-badge status-${action.status}`}>
                          {action.status}
                        </span>
                      </div>
                      <p className="action-description">{action.action}</p>
                      <div className="action-details">
                        <span>Responsible: {action.responsiblePerson}</span>
                        <span>Due: {new Date(action.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-sm btn-danger"
                      onClick={() => removeCorrectiveAction(action.id)}
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Follow-up</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Follow-up Date (Optional)</label>
              <input
                type="date"
                className="form-control"
                value={formData.followUpDate}
                onChange={(e) => setFormData({...formData, followUpDate: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Inspector Name (Digital Signature) *</label>
              <input
                type="text"
                className="form-control"
                value={formData.signature}
                onChange={(e) => setFormData({...formData, signature: e.target.value})}
                placeholder="Enter your full name as signature..."
                required
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Inspection Report'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => {
            setFormData({
              type: type,
              inspectionDate: new Date().toISOString().split('T')[0],
              location: '',
              findings: [],
              correctiveActions: [],
              followUpDate: '',
              signature: '',
            });
          }}>
            Reset Form
          </button>
        </div>
      </form>

      <div className="recent-irs">
        <h3>Recent Inspection Reports</h3>
        <div className="ir-list">
          {irs.filter(ir => ir.type === formData.type).slice(0, 5).map(ir => (
            <div key={ir.id} className="ir-summary card">
              <div className="ir-header">
                <span className="ir-number">{ir.irNumber}</span>
                <span className={`badge badge-${
                  ir.status === 'closed' ? 'success' : 
                  ir.status === 'open' ? 'warning' : 'info'
                }`}>
                  {ir.status}
                </span>
              </div>
              <div className="ir-details">
                <span>Type: {ir.type}</span>
                <span>Location: {ir.location}</span>
                <span>Date: {new Date(ir.inspectionDate).toLocaleDateString()}</span>
                <span>Findings: {ir.findings.length}</span>
                <span>Actions: {ir.correctiveActions.length}</span>
              </div>
            </div>
          ))}
          {irs.filter(ir => ir.type === formData.type).length === 0 && (
            <div className="empty-state">
              No {formData.type} inspection reports yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IRForm;