import React, { useState, useEffect } from 'react';
import { useLogistics } from '../../context/LogisticsContext';
import { Delivery, Vendor, Material } from '../../types/logistics.types';
import { getVendors, getMaterials } from '../../services/logisticsService';
import './DeliveryScheduler.css';

const DeliveryScheduler: React.FC = () => {
  const { deliveries, createDelivery, updateDelivery, deleteDelivery, loading } = useLogistics();
  const [showForm, setShowForm] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    vendorId: '',
    materialIds: [] as string[],
    scheduledDate: '',
    notes: '',
    status: 'scheduled' as Delivery['status'],
  });

  useEffect(() => {
    // Load vendors and materials
    Promise.all([getVendors(), getMaterials()]).then(([vendorsData, materialsData]) => {
      setVendors(vendorsData);
      setMaterials(materialsData);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedVendor = vendors.find(v => v.id === formData.vendorId);
    const selectedMaterials = materials.filter(m => formData.materialIds.includes(m.id));
    
    if (!selectedVendor || selectedMaterials.length === 0) {
      alert('Please select a vendor and at least one material');
      return;
    }

    const deliveryData: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
      deliveryNumber: `DEL-${new Date().getFullYear()}-${String(deliveries.length + 1).padStart(3, '0')}`,
      vendor: selectedVendor,
      materials: selectedMaterials,
      scheduledDate: new Date(formData.scheduledDate),
      status: formData.status,
      notes: formData.notes,
      createdBy: 'current-user',
    };

    try {
      if (editingDelivery) {
        await updateDelivery(editingDelivery.id, deliveryData);
      } else {
        await createDelivery(deliveryData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving delivery:', error);
      alert('Failed to save delivery');
    }
  };

  const resetForm = () => {
    setFormData({
      vendorId: '',
      materialIds: [],
      scheduledDate: '',
      notes: '',
      status: 'scheduled',
    });
    setShowForm(false);
    setEditingDelivery(null);
  };

  const handleEdit = (delivery: Delivery) => {
    setEditingDelivery(delivery);
    setFormData({
      vendorId: delivery.vendor.id,
      materialIds: delivery.materials.map(m => m.id),
      scheduledDate: new Date(delivery.scheduledDate).toISOString().split('T')[0],
      notes: delivery.notes,
      status: delivery.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this delivery?')) {
      try {
        await deleteDelivery(id);
      } catch (error) {
        console.error('Error deleting delivery:', error);
        alert('Failed to delete delivery');
      }
    }
  };

  const handleStatusUpdate = async (delivery: Delivery, newStatus: Delivery['status']) => {
    try {
      const updates: Partial<Delivery> = { status: newStatus };
      if (newStatus === 'delivered') {
        updates.actualDate = new Date();
      }
      await updateDelivery(delivery.id, updates);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  return (
    <div className="delivery-scheduler">
      <div className="scheduler-header">
        <h2>Delivery Scheduler</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Schedule New Delivery'}
        </button>
      </div>

      {showForm && (
        <div className="delivery-form card">
          <h3>{editingDelivery ? 'Edit Delivery' : 'Schedule New Delivery'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Vendor *</label>
                <select
                  className="form-control form-select"
                  value={formData.vendorId}
                  onChange={(e) => setFormData({...formData, vendorId: e.target.value})}
                  required
                >
                  <option value="">Select a vendor</option>
                  {vendors.map(vendor => (
                    <option key={vendor.id} value={vendor.id}>
                      {vendor.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Scheduled Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Materials *</label>
              <div className="material-checkboxes">
                {materials.map(material => (
                  <label key={material.id} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={material.id}
                      checked={formData.materialIds.includes(material.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            materialIds: [...formData.materialIds, material.id]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            materialIds: formData.materialIds.filter(id => id !== material.id)
                          });
                        }
                      }}
                    />
                    <span>{material.name} ({material.quantity} {material.unit})</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-control form-select"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Delivery['status']})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  placeholder="Additional notes or instructions..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-success" disabled={loading}>
                {loading ? 'Saving...' : editingDelivery ? 'Update Delivery' : 'Schedule Delivery'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="deliveries-list">
        <h3>Scheduled Deliveries</h3>
        <div className="delivery-cards">
          {deliveries.map(delivery => (
            <div key={delivery.id} className="delivery-card card">
              <div className="delivery-header">
                <h4>{delivery.deliveryNumber}</h4>
                <span className={`badge badge-${
                  delivery.status === 'delivered' ? 'success' :
                  delivery.status === 'cancelled' ? 'danger' :
                  delivery.status === 'in-transit' ? 'warning' : 'info'
                }`}>
                  {delivery.status}
                </span>
              </div>
              
              <div className="delivery-details">
                <div className="detail-row">
                  <span className="detail-label">Vendor:</span>
                  <span className="detail-value">{delivery.vendor.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Scheduled:</span>
                  <span className="detail-value">
                    {new Date(delivery.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
                {delivery.actualDate && (
                  <div className="detail-row">
                    <span className="detail-label">Actual:</span>
                    <span className="detail-value">
                      {new Date(delivery.actualDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="detail-label">Materials:</span>
                  <div className="materials-list">
                    {delivery.materials.map(material => (
                      <span key={material.id} className="material-chip">
                        {material.name} ({material.quantity} {material.unit})
                      </span>
                    ))}
                  </div>
                </div>
                {delivery.notes && (
                  <div className="detail-row">
                    <span className="detail-label">Notes:</span>
                    <span className="detail-value">{delivery.notes}</span>
                  </div>
                )}
              </div>

              <div className="delivery-actions">
                {delivery.status !== 'delivered' && delivery.status !== 'cancelled' && (
                  <>
                    {delivery.status === 'scheduled' && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleStatusUpdate(delivery, 'in-transit')}
                      >
                        Mark In Transit
                      </button>
                    )}
                    {delivery.status === 'in-transit' && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => handleStatusUpdate(delivery, 'delivered')}
                      >
                        Mark Delivered
                      </button>
                    )}
                  </>
                )}
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => handleEdit(delivery)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(delivery.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {deliveries.length === 0 && (
            <div className="empty-state">
              <p>No deliveries scheduled yet.</p>
              <p>Click "Schedule New Delivery" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliveryScheduler;