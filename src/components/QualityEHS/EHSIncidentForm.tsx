import React, { useState } from 'react';
import './EHSIncidentForm.css';

interface EHSIncidentFormProps {
  onClose: () => void;
}

const EHSIncidentForm: React.FC<EHSIncidentFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    type: 'safety',
    severity: 'minor',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    reportedBy: '',
    witnesses: '',
    immediateAction: '',
    preventiveMeasures: '',
    photos: [] as File[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting incident:', formData);
    // In production, this would send data to API
    alert('Incident reported successfully!');
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="incident-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Report EHS Incident</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="incident-form">
          <div className="form-section">
            <h3 className="section-title">Incident Details</h3>
            
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label required">Incident Type</label>
                <select
                  name="type"
                  className="form-select"
                  value={formData.type}
                  onChange={handleChange}
                  required
                >
                  <option value="safety">Safety</option>
                  <option value="health">Health</option>
                  <option value="environmental">Environmental</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label required">Severity</label>
                <select
                  name="severity"
                  className="form-select"
                  value={formData.severity}
                  onChange={handleChange}
                  required
                >
                  <option value="minor">Minor</option>
                  <option value="moderate">Moderate</option>
                  <option value="major">Major</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label required">Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe the incident in detail..."
                value={formData.description}
                onChange={handleChange}
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g., Building A, Level 3, Zone 5"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label required">Date</label>
                <input
                  type="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label required">Time</label>
                <input
                  type="time"
                  name="time"
                  className="form-input"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">People Involved</h3>
            
            <div className="form-group">
              <label className="form-label required">Reported By</label>
              <input
                type="text"
                name="reportedBy"
                className="form-input"
                placeholder="Your name"
                value={formData.reportedBy}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Witnesses</label>
              <textarea
                name="witnesses"
                className="form-textarea"
                placeholder="List names of witnesses (one per line)"
                value={formData.witnesses}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Actions Taken</h3>
            
            <div className="form-group">
              <label className="form-label">Immediate Action Taken</label>
              <textarea
                name="immediateAction"
                className="form-textarea"
                placeholder="Describe any immediate actions taken..."
                value={formData.immediateAction}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preventive Measures Recommended</label>
              <textarea
                name="preventiveMeasures"
                className="form-textarea"
                placeholder="Suggest preventive measures to avoid recurrence..."
                value={formData.preventiveMeasures}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div className="form-section">
            <h3 className="section-title">Attachments</h3>
            
            <div className="form-group">
              <label className="form-label">Photos/Documents</label>
              <div className="file-upload">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="file-input"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData(prev => ({
                        ...prev,
                        photos: Array.from(e.target.files || [])
                      }));
                    }
                  }}
                />
                <div className="file-upload-label">
                  <span className="upload-icon">📁</span>
                  <span>Click to upload or drag and drop</span>
                  <span className="upload-hint">PNG, JPG, PDF up to 10MB</span>
                </div>
              </div>
              {formData.photos.length > 0 && (
                <div className="file-list">
                  {formData.photos.map((file, index) => (
                    <div key={index} className="file-item">
                      📎 {file.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-danger">
              Report Incident
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EHSIncidentForm;