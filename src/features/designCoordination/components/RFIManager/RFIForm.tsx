import React, { useState } from 'react';
import { RFI, Priority } from '../../types';
import './RFIForm.css';

interface RFIFormProps {
  onSubmit: (rfi: Partial<RFI>) => void;
  onCancel: () => void;
  initialData?: Partial<RFI>;
}

const RFIForm: React.FC<RFIFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState<Partial<RFI>>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || Priority.MEDIUM,
    assignedTo: initialData?.assignedTo || '',
    dueDate: initialData?.dueDate,
    ...initialData,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="rfi-form-modal">
      <div className="rfi-form-content">
        <h2 className="rfi-form-title">
          {initialData ? 'Edit RFI' : 'Create New RFI'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              placeholder="Provide detailed description of the information needed..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="priority">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                className="form-control form-select"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value={Priority.LOW}>Low</option>
                <option value={Priority.MEDIUM}>Medium</option>
                <option value={Priority.HIGH}>High</option>
                <option value={Priority.CRITICAL}>Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dueDate">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                className="form-control"
                value={
                  formData.dueDate
                    ? new Date(formData.dueDate).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined,
                  }));
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="assignedTo">
              Assign To
            </label>
            <select
              id="assignedTo"
              name="assignedTo"
              className="form-control form-select"
              value={formData.assignedTo}
              onChange={handleChange}
            >
              <option value="">Select assignee...</option>
              <option value="user-6">Robert Brown (Structural Engineer)</option>
              <option value="user-7">Jennifer Lee (MEP Coordinator)</option>
              <option value="user-8">Tom Garcia (Architect)</option>
              <option value="user-9">Maria Rodriguez (Fire Protection Engineer)</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {initialData ? 'Update RFI' : 'Create RFI'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RFIForm;