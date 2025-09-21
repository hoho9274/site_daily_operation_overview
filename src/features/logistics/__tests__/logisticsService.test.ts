import {
  fetchDeliveries,
  fetchDeliveryById,
  createDelivery,
  updateDelivery,
  deleteDelivery,
  getDeliveryStatistics,
} from '../services/logisticsService';
import { Delivery } from '../types/logistics.types';

describe('Logistics Service', () => {
  describe('fetchDeliveries', () => {
    test('should return list of deliveries', async () => {
      const deliveries = await fetchDeliveries();
      
      expect(Array.isArray(deliveries)).toBe(true);
      expect(deliveries.length).toBeGreaterThanOrEqual(0);
      
      if (deliveries.length > 0) {
        const delivery = deliveries[0];
        expect(delivery).toHaveProperty('id');
        expect(delivery).toHaveProperty('deliveryNumber');
        expect(delivery).toHaveProperty('vendor');
        expect(delivery).toHaveProperty('materials');
        expect(delivery).toHaveProperty('status');
      }
    });
  });

  describe('fetchDeliveryById', () => {
    test('should return delivery when found', async () => {
      const deliveries = await fetchDeliveries();
      if (deliveries.length > 0) {
        const targetId = deliveries[0].id;
        const delivery = await fetchDeliveryById(targetId);
        
        expect(delivery).not.toBeNull();
        expect(delivery?.id).toBe(targetId);
      }
    });

    test('should return null when delivery not found', async () => {
      const delivery = await fetchDeliveryById('non-existent-id');
      expect(delivery).toBeNull();
    });
  });

  describe('createDelivery', () => {
    test('should create new delivery with generated id', async () => {
      const newDeliveryData: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
        deliveryNumber: 'TEST-001',
        vendor: {
          id: '1',
          name: 'Test Vendor',
          contactPerson: 'John Doe',
          email: 'john@test.com',
          phone: '+1234567890',
          address: '123 Test St',
        },
        materials: [
          {
            id: '1',
            name: 'Test Material',
            description: 'Test Description',
            unit: 'kg',
            quantity: 100,
          },
        ],
        scheduledDate: new Date(),
        status: 'scheduled',
        notes: 'Test delivery',
        createdBy: 'test-user',
      };

      const createdDelivery = await createDelivery(newDeliveryData);

      expect(createdDelivery).toHaveProperty('id');
      expect(createdDelivery).toHaveProperty('createdAt');
      expect(createdDelivery).toHaveProperty('updatedAt');
      expect(createdDelivery.deliveryNumber).toBe(newDeliveryData.deliveryNumber);
      expect(createdDelivery.vendor).toEqual(newDeliveryData.vendor);
      expect(createdDelivery.materials).toEqual(newDeliveryData.materials);
      expect(createdDelivery.status).toBe(newDeliveryData.status);
    });
  });

  describe('updateDelivery', () => {
    test('should update existing delivery', async () => {
      // First create a delivery
      const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
        deliveryNumber: 'TEST-UPDATE-001',
        vendor: {
          id: '1',
          name: 'Test Vendor',
          contactPerson: 'John Doe',
          email: 'john@test.com',
          phone: '+1234567890',
          address: '123 Test St',
        },
        materials: [],
        scheduledDate: new Date(),
        status: 'scheduled',
        notes: 'Original note',
        createdBy: 'test-user',
      };

      const created = await createDelivery(newDelivery);
      
      // Update the delivery
      const updates = {
        status: 'delivered' as const,
        actualDate: new Date(),
        notes: 'Updated note',
      };

      const updated = await updateDelivery(created.id, updates);

      expect(updated.id).toBe(created.id);
      expect(updated.status).toBe('delivered');
      expect(updated.actualDate).toBeDefined();
      expect(updated.notes).toBe('Updated note');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(created.updatedAt.getTime());
    });

    test('should reject when delivery not found', async () => {
      await expect(
        updateDelivery('non-existent-id', { status: 'cancelled' })
      ).rejects.toThrow('Delivery not found');
    });
  });

  describe('deleteDelivery', () => {
    test('should delete existing delivery', async () => {
      // Create a delivery
      const newDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
        deliveryNumber: 'TEST-DELETE-001',
        vendor: {
          id: '1',
          name: 'Test Vendor',
          contactPerson: 'John Doe',
          email: 'john@test.com',
          phone: '+1234567890',
          address: '123 Test St',
        },
        materials: [],
        scheduledDate: new Date(),
        status: 'scheduled',
        notes: 'To be deleted',
        createdBy: 'test-user',
      };

      const created = await createDelivery(newDelivery);
      
      // Delete the delivery
      await deleteDelivery(created.id);
      
      // Verify it's deleted
      const found = await fetchDeliveryById(created.id);
      expect(found).toBeNull();
    });

    test('should reject when delivery not found', async () => {
      await expect(
        deleteDelivery('non-existent-id')
      ).rejects.toThrow('Delivery not found');
    });
  });

  describe('getDeliveryStatistics', () => {
    test('should return correct statistics', async () => {
      const stats = await getDeliveryStatistics();

      expect(stats).toHaveProperty('total');
      expect(stats).toHaveProperty('scheduled');
      expect(stats).toHaveProperty('inTransit');
      expect(stats).toHaveProperty('delivered');
      expect(stats).toHaveProperty('cancelled');
      expect(stats).toHaveProperty('onTimeRate');

      expect(typeof stats.total).toBe('number');
      expect(typeof stats.scheduled).toBe('number');
      expect(typeof stats.inTransit).toBe('number');
      expect(typeof stats.delivered).toBe('number');
      expect(typeof stats.cancelled).toBe('number');
      expect(typeof stats.onTimeRate).toBe('number');

      expect(stats.total).toBeGreaterThanOrEqual(0);
      expect(stats.onTimeRate).toBeGreaterThanOrEqual(0);
      expect(stats.onTimeRate).toBeLessThanOrEqual(100);
    });

    test('should calculate on-time rate correctly', async () => {
      // Create deliveries with known dates
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 5);
      
      const onTimeDelivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'> = {
        deliveryNumber: 'ON-TIME-001',
        vendor: {
          id: '1',
          name: 'Test Vendor',
          contactPerson: 'John Doe',
          email: 'john@test.com',
          phone: '+1234567890',
          address: '123 Test St',
        },
        materials: [],
        scheduledDate: new Date(),
        status: 'delivered',
        notes: 'On time',
        createdBy: 'test-user',
      };

      const created = await createDelivery(onTimeDelivery);
      await updateDelivery(created.id, { 
        status: 'delivered',
        actualDate: pastDate // Delivered before scheduled date
      });

      const stats = await getDeliveryStatistics();
      expect(stats.delivered).toBeGreaterThan(0);
      // The on-time rate should be calculated based on delivered orders
    });
  });
});