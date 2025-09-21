import React, { useState, useEffect } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { 
  MIR, 
  MaterialInspection, 
  ChecklistItem,
  NonConformance,
  InspectionTemplate
} from '../../types/logistics.types';
import { getInspectionTemplates, getMaterials } from '../../services/mirService';
import './MIRForm.css';

const MIRForm: React.FC = () => {
  const { mirs, createMIR, loading } = useLogistics();
  const [templates, setTemplates] = useState<InspectionTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<InspectionTemplate | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    deliveryId: '',
    inspectionDate: new Date().toISOString().split('T')[0],
    materials: [] as MaterialInspection[],
    nonConformances: [] as Omit<NonConformance, 'id'>[],
    signature: '',
  });

  const [currentMaterial, setCurrentMaterial] = useState<MaterialInspection>({
    materialId: '',
    materialName: '',
    quantity: 0,
    unit: '',
    checklist: [],
    status: 'passed',
    comments: '',
  });

  const [showNonConformanceForm, setShowNonConformanceForm] = useState(false);
  const [newNonConformance, setNewNonConformance] = useState({
    description: '',
    severity: 'minor' as NonConformance['severity'],
    correctiveAction: '',
    status: 'open' as NonConformance['status'],
  });

  useEffect(() => {
    // Load templates
    getInspectionTemplates().then(setTemplates);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
      // Initialize checklist from template
      const checklist = template.checklist.map(item => ({
        ...item,
        checked: false,
        result: undefined,
        comments: '',
      }));
      setCurrentMaterial({
        ...currentMaterial,
        checklist,
      });
    }
  };

  const handleChecklistItemChange = (
    index: number, 
    field: keyof ChecklistItem, 
    value: any
  ) => {
    const updatedChecklist = [...currentMaterial.checklist];
    updatedChecklist[index] = {
      ...updatedChecklist[index],
      [field]: value,
    };
    
    // Update material status based on checklist results
    const hasFailure = updatedChecklist.some(item => item.result === 'fail');
    const hasConditional = updatedChecklist.some(item => item.result === 'n/a');
    
    setCurrentMaterial({
      ...currentMaterial,
      checklist: updatedChecklist,
      status: hasFailure ? 'failed' : hasConditional ? 'conditional' : 'passed',
    });
  };

  const addMaterialInspection = () => {
    if (!currentMaterial.materialName || currentMaterial.quantity === 0) {
      alert('Please fill in material details');
      return;
    }

    setFormData({
      ...formData,
      materials: [...formData.materials, currentMaterial],
    });

    // Reset current material
    setCurrentMaterial({
      materialId: '',
      materialName: '',
      quantity: 0,
      unit: '',
      checklist: selectedTemplate?.checklist || [],
      status: 'passed',
      comments: '',
    });
  };

  const removeMaterial = (index: number) => {
    setFormData({
      ...formData,
      materials: formData.materials.filter((_, i) => i !== index),
    });
  };

  const addNonConformance = () => {
    if (!newNonConformance.description) {
      alert('Please provide a description for the non-conformance');
      return;
    }

    setFormData({
      ...formData,
      nonConformances: [...formData.nonConformances, newNonConformance],
    });

    setNewNonConformance({
      description: '',
      severity: 'minor',
      correctiveAction: '',
      status: 'open',
    });
    setShowNonConformanceForm(false);
  };

  const removeNonConformance = (index: number) => {
    setFormData({
      ...formData,
      nonConformances: formData.nonConformances.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.materials.length === 0) {
      alert('Please add at least one material inspection');
      return;
    }

    if (!formData.signature) {
      alert('Please provide your signature');
      return;
    }

    // Determine overall status
    const hasFailure = formData.materials.some(m => m.status === 'failed');
    const hasConditional = formData.materials.some(m => m.status === 'conditional');
    const overallStatus = hasFailure ? 'failed' : hasConditional ? 'conditional' : 'passed';

    const mirData: Omit<MIR, 'id' | 'createdAt' | 'updatedAt'> = {
      mirNumber: `MIR-${new Date().getFullYear()}-${String(mirs.length + 1).padStart(3, '0')}`,
      deliveryId: formData.deliveryId || undefined,
      inspectionDate: new Date(formData.inspectionDate),
      inspector: {
        id: 'current-user',
        name: formData.signature,
        email: 'inspector@company.com',
        role: 'Quality Inspector',
      },
      materials: formData.materials,
      overallStatus,
      photos: [],
      nonConformances: formData.nonConformances as NonConformance[],
      signature: formData.signature,
    };

    try {
      await createMIR(mirData);
      alert('Material Inspection Report created successfully!');
      // Reset form
      setFormData({
        deliveryId: '',
        inspectionDate: new Date().toISOString().split('T')[0],
        materials: [],
        nonConformances: [],
        signature: '',
      });
      setSelectedTemplate(null);
    } catch (error) {
      console.error('Error creating MIR:', error);
      alert('Failed to create MIR');
    }
  };

  return (
    <div className="mir-form-container">
      <h2>Material Inspection Report (MIR)</h2>
      
      <form onSubmit={handleSubmit} className="mir-form card">
        <div className="form-section">
          <h3>Inspection Details</h3>
          <div className="form-row">
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
              <label className="form-label">Delivery ID (Optional)</label>
              <input
                type="text"
                className="form-control"
                value={formData.deliveryId}
                onChange={(e) => setFormData({...formData, deliveryId: e.target.value})}
                placeholder="Link to delivery..."
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Material Inspection</h3>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Inspection Template</label>
              <select
                className="form-control form-select"
                onChange={(e) => handleTemplateSelect(e.target.value)}
              >
                <option value="">Select template...</option>
                {templates.map(template => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="material-inspection-form">
            <h4>Add Material</h4>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Material Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMaterial.materialName}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, materialName: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Quantity *</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentMaterial.quantity}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, quantity: Number(e.target.value)})}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Unit *</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMaterial.unit}
                  onChange={(e) => setCurrentMaterial({...currentMaterial, unit: e.target.value})}
                  placeholder="bags, tons, pieces..."
                />
              </div>
            </div>

            {currentMaterial.checklist.length > 0 && (
              <div className="checklist-section">
                <h5>Inspection Checklist</h5>
                <div className="checklist-items">
                  {currentMaterial.checklist.map((item, index) => (
                    <div key={item.id} className="checklist-item">
                      <div className="checklist-row">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={(e) => handleChecklistItemChange(index, 'checked', e.target.checked)}
                        />
                        <span className="checklist-description">{item.description}</span>
                      </div>
                      {item.checked && (
                        <div className="checklist-details">
                          <select
                            className="form-control form-select small"
                            value={item.result || ''}
                            onChange={(e) => handleChecklistItemChange(index, 'result', e.target.value)}
                          >
                            <option value="">Select result...</option>
                            <option value="pass">Pass</option>
                            <option value="fail">Fail</option>
                            <option value="n/a">N/A</option>
                          </select>
                          <input
                            type="text"
                            className="form-control small"
                            placeholder="Comments..."
                            value={item.comments || ''}
                            onChange={(e) => handleChecklistItemChange(index, 'comments', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Additional Comments</label>
              <textarea
                className="form-control"
                rows={2}
                value={currentMaterial.comments}
                onChange={(e) => setCurrentMaterial({...currentMaterial, comments: e.target.value})}
                placeholder="Any additional observations..."
              />
            </div>

            <button type="button" className="btn btn-secondary" onClick={addMaterialInspection}>
              Add Material to Inspection
            </button>
          </div>

          {formData.materials.length > 0 && (
            <div className="materials-added">
              <h4>Materials Added ({formData.materials.length})</h4>
              {formData.materials.map((material, index) => (
                <div key={index} className="material-item">
                  <div className="material-info">
                    <span className="material-name">{material.materialName}</span>
                    <span>{material.quantity} {material.unit}</span>
                    <span className={`badge badge-${
                      material.status === 'passed' ? 'success' : 
                      material.status === 'failed' ? 'danger' : 'warning'
                    }`}>
                      {material.status}
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => removeMaterial(index)}
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
            <h3>Non-Conformances</h3>
            <button 
              type="button" 
              className="btn btn-sm btn-warning"
              onClick={() => setShowNonConformanceForm(!showNonConformanceForm)}
            >
              {showNonConformanceForm ? 'Cancel' : '+ Add Non-Conformance'}
            </button>
          </div>

          {showNonConformanceForm && (
            <div className="non-conformance-form">
              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={newNonConformance.description}
                  onChange={(e) => setNewNonConformance({...newNonConformance, description: e.target.value})}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Severity</label>
                  <select
                    className="form-control form-select"
                    value={newNonConformance.severity}
                    onChange={(e) => setNewNonConformance({
                      ...newNonConformance, 
                      severity: e.target.value as NonConformance['severity']
                    })}
                  >
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Corrective Action</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newNonConformance.correctiveAction || ''}
                    onChange={(e) => setNewNonConformance({...newNonConformance, correctiveAction: e.target.value})}
                  />
                </div>
              </div>
              <button type="button" className="btn btn-warning" onClick={addNonConformance}>
                Add Non-Conformance
              </button>
            </div>
          )}

          {formData.nonConformances.length > 0 && (
            <div className="non-conformances-list">
              {formData.nonConformances.map((nc, index) => (
                <div key={index} className="non-conformance-item">
                  <div className="nc-info">
                    <span className={`severity-badge severity-${nc.severity}`}>
                      {nc.severity}
                    </span>
                    <span className="nc-description">{nc.description}</span>
                  </div>
                  <button 
                    type="button" 
                    className="btn btn-sm btn-danger"
                    onClick={() => removeNonConformance(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h3>Inspector Signature</h3>
          <div className="form-group">
            <label className="form-label">Your Name (Digital Signature) *</label>
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

        <div className="form-actions">
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit MIR'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => {
            setFormData({
              deliveryId: '',
              inspectionDate: new Date().toISOString().split('T')[0],
              materials: [],
              nonConformances: [],
              signature: '',
            });
          }}>
            Reset Form
          </button>
        </div>
      </form>

      <div className="recent-mirs">
        <h3>Recent MIRs</h3>
        <div className="mir-list">
          {mirs.slice(0, 5).map(mir => (
            <div key={mir.id} className="mir-summary card">
              <div className="mir-header">
                <span className="mir-number">{mir.mirNumber}</span>
                <span className={`badge badge-${
                  mir.overallStatus === 'passed' ? 'success' : 
                  mir.overallStatus === 'failed' ? 'danger' : 'warning'
                }`}>
                  {mir.overallStatus}
                </span>
              </div>
              <div className="mir-details">
                <span>Date: {new Date(mir.inspectionDate).toLocaleDateString()}</span>
                <span>Inspector: {mir.inspector.name}</span>
                <span>Materials: {mir.materials.length}</span>
                {mir.nonConformances.length > 0 && (
                  <span className="nc-count">⚠️ {mir.nonConformances.length} NC(s)</span>
                )}
              </div>
            </div>
          ))}
          {mirs.length === 0 && (
            <div className="empty-state">
              No MIRs created yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MIRForm;