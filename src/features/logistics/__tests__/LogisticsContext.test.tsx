import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react';
import { LogisticsProvider, useLogistics } from '../context/LogisticsContext';
import * as logisticsService from '../services/logisticsService';
import * as mirService from '../services/mirService';
import * as irService from '../services/irService';

// Mock the services
jest.mock('../services/logisticsService');
jest.mock('../services/mirService');
jest.mock('../services/irService');

describe('LogisticsContext', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <LogisticsProvider>{children}</LogisticsProvider>
  );

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock responses
    (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue([]);
    (mirService.fetchMIRs as jest.Mock).mockResolvedValue([]);
    (irService.fetchIRs as jest.Mock).mockResolvedValue([]);
  });

  describe('Initial State', () => {
    test('provides initial state correctly', async () => {
      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.deliveries).toEqual([]);
      expect(result.current.mirs).toEqual([]);
      expect(result.current.irs).toEqual([]);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Delivery Operations', () => {
    test('creates a new delivery', async () => {
      const newDelivery = {
        deliveryNumber: 'DEL-2024-001',
        vendor: { id: '1', name: 'Test Vendor', contactPerson: 'John', email: 'test@test.com', phone: '123', address: 'Test' },
        materials: [{ id: '1', name: 'Material 1', description: 'Test', unit: 'kg', quantity: 10 }],
        scheduledDate: new Date(),
        status: 'scheduled' as const,
        notes: 'Test delivery',
        createdBy: 'test-user',
      };

      const createdDelivery = { ...newDelivery, id: '1', createdAt: new Date(), updatedAt: new Date() };
      (logisticsService.createDelivery as jest.Mock).mockResolvedValue(createdDelivery);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await act(async () => {
        await result.current.createDelivery(newDelivery);
      });

      expect(logisticsService.createDelivery).toHaveBeenCalledWith(newDelivery);
      expect(result.current.deliveries).toContainEqual(createdDelivery);
    });

    test('updates an existing delivery', async () => {
      const existingDelivery = {
        id: '1',
        deliveryNumber: 'DEL-2024-001',
        vendor: { id: '1', name: 'Test Vendor', contactPerson: 'John', email: 'test@test.com', phone: '123', address: 'Test' },
        materials: [],
        scheduledDate: new Date(),
        status: 'scheduled' as const,
        notes: 'Test',
        createdBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue([existingDelivery]);
      
      const updates = { status: 'delivered' as const, actualDate: new Date() };
      const updatedDelivery = { ...existingDelivery, ...updates };
      (logisticsService.updateDelivery as jest.Mock).mockResolvedValue(updatedDelivery);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.deliveries).toHaveLength(1);
      });

      await act(async () => {
        await result.current.updateDelivery('1', updates);
      });

      expect(logisticsService.updateDelivery).toHaveBeenCalledWith('1', updates);
      expect(result.current.deliveries[0].status).toBe('delivered');
    });

    test('deletes a delivery', async () => {
      const delivery = {
        id: '1',
        deliveryNumber: 'DEL-2024-001',
        vendor: { id: '1', name: 'Test Vendor', contactPerson: 'John', email: 'test@test.com', phone: '123', address: 'Test' },
        materials: [],
        scheduledDate: new Date(),
        status: 'scheduled' as const,
        notes: 'Test',
        createdBy: 'test-user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue([delivery]);
      (logisticsService.deleteDelivery as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.deliveries).toHaveLength(1);
      });

      await act(async () => {
        await result.current.deleteDelivery('1');
      });

      expect(logisticsService.deleteDelivery).toHaveBeenCalledWith('1');
      expect(result.current.deliveries).toHaveLength(0);
    });
  });

  describe('MIR Operations', () => {
    test('creates a new MIR', async () => {
      const newMIR = {
        mirNumber: 'MIR-2024-001',
        inspectionDate: new Date(),
        inspector: { id: '1', name: 'Inspector', email: 'inspector@test.com', role: 'Quality Inspector' },
        materials: [],
        overallStatus: 'passed' as const,
        photos: [],
        nonConformances: [],
        signature: 'Inspector',
      };

      const createdMIR = { ...newMIR, id: '1', createdAt: new Date(), updatedAt: new Date() };
      (mirService.createMIR as jest.Mock).mockResolvedValue(createdMIR);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await act(async () => {
        await result.current.createMIR(newMIR);
      });

      expect(mirService.createMIR).toHaveBeenCalledWith(newMIR);
      expect(result.current.mirs).toContainEqual(createdMIR);
    });

    test('updates an existing MIR', async () => {
      const existingMIR = {
        id: '1',
        mirNumber: 'MIR-2024-001',
        inspectionDate: new Date(),
        inspector: { id: '1', name: 'Inspector', email: 'inspector@test.com', role: 'Quality Inspector' },
        materials: [],
        overallStatus: 'passed' as const,
        photos: [],
        nonConformances: [],
        signature: 'Inspector',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mirService.fetchMIRs as jest.Mock).mockResolvedValue([existingMIR]);
      
      const updates = { overallStatus: 'failed' as const };
      const updatedMIR = { ...existingMIR, ...updates };
      (mirService.updateMIR as jest.Mock).mockResolvedValue(updatedMIR);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.mirs).toHaveLength(1);
      });

      await act(async () => {
        await result.current.updateMIR('1', updates);
      });

      expect(mirService.updateMIR).toHaveBeenCalledWith('1', updates);
      expect(result.current.mirs[0].overallStatus).toBe('failed');
    });
  });

  describe('IR Operations', () => {
    test('creates a new IR', async () => {
      const newIR = {
        irNumber: 'IR-2024-001',
        type: 'safety' as const,
        inspectionDate: new Date(),
        inspector: { id: '1', name: 'Safety Inspector', email: 'safety@test.com', role: 'Safety Inspector' },
        location: 'Site A',
        findings: [],
        correctiveActions: [],
        status: 'open' as const,
        photos: [],
      };

      const createdIR = { ...newIR, id: '1', createdAt: new Date(), updatedAt: new Date() };
      (irService.createIR as jest.Mock).mockResolvedValue(createdIR);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await act(async () => {
        await result.current.createIR(newIR);
      });

      expect(irService.createIR).toHaveBeenCalledWith(newIR);
      expect(result.current.irs).toContainEqual(createdIR);
    });

    test('adds corrective action to IR', async () => {
      const existingIR = {
        id: '1',
        irNumber: 'IR-2024-001',
        type: 'safety' as const,
        inspectionDate: new Date(),
        inspector: { id: '1', name: 'Safety Inspector', email: 'safety@test.com', role: 'Safety Inspector' },
        location: 'Site A',
        findings: [{ id: '1', description: 'Finding 1', severity: 'major' as const, category: 'Safety' }],
        correctiveActions: [],
        status: 'open' as const,
        photos: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (irService.fetchIRs as jest.Mock).mockResolvedValue([existingIR]);

      const newAction = {
        findingId: '1',
        action: 'Fix the issue',
        responsiblePerson: 'Manager',
        dueDate: new Date(),
        status: 'pending' as const,
      };

      const updatedIR = {
        ...existingIR,
        correctiveActions: [{ ...newAction, id: '1' }],
      };
      (irService.addCorrectiveAction as jest.Mock).mockResolvedValue(updatedIR);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.irs).toHaveLength(1);
      });

      await act(async () => {
        await result.current.addCorrectiveAction('1', newAction);
      });

      expect(irService.addCorrectiveAction).toHaveBeenCalledWith('1', newAction);
      expect(result.current.irs[0].correctiveActions).toHaveLength(1);
    });
  });

  describe('Metrics Calculation', () => {
    test('calculates metrics correctly', async () => {
      const mockDeliveries = [
        {
          id: '1',
          deliveryNumber: 'DEL-001',
          vendor: { id: '1', name: 'Vendor', contactPerson: 'John', email: 'test@test.com', phone: '123', address: 'Test' },
          materials: [],
          scheduledDate: new Date('2024-01-01'),
          actualDate: new Date('2024-01-01'),
          status: 'delivered' as const,
          notes: '',
          createdBy: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockMIRs = [
        {
          id: '1',
          mirNumber: 'MIR-001',
          inspectionDate: new Date(),
          inspector: { id: '1', name: 'Inspector', email: 'inspector@test.com', role: 'Inspector' },
          materials: [],
          overallStatus: 'passed' as const,
          photos: [],
          nonConformances: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockIRs = [
        {
          id: '1',
          irNumber: 'IR-001',
          type: 'safety' as const,
          inspectionDate: new Date(),
          inspector: { id: '1', name: 'Inspector', email: 'inspector@test.com', role: 'Inspector' },
          location: 'Site',
          findings: [],
          correctiveActions: [],
          status: 'open' as const,
          photos: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (logisticsService.fetchDeliveries as jest.Mock).mockResolvedValue(mockDeliveries);
      (mirService.fetchMIRs as jest.Mock).mockResolvedValue(mockMIRs);
      (irService.fetchIRs as jest.Mock).mockResolvedValue(mockIRs);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.metrics).not.toBeNull();
      });

      expect(result.current.metrics?.totalDeliveries).toBe(1);
      expect(result.current.metrics?.completedDeliveries).toBe(1);
      expect(result.current.metrics?.totalMIRs).toBe(1);
      expect(result.current.metrics?.passedMIRs).toBe(1);
      expect(result.current.metrics?.totalIRs).toBe(1);
      expect(result.current.metrics?.openIRs).toBe(1);
      expect(result.current.metrics?.deliveryOnTimeRate).toBe(100);
      expect(result.current.metrics?.inspectionComplianceRate).toBe(100);
    });
  });

  describe('Error Handling', () => {
    test('handles error when fetching deliveries fails', async () => {
      const error = new Error('Failed to fetch deliveries');
      (logisticsService.fetchDeliveries as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.error?.message).toBe('Failed to fetch deliveries');
    });

    test('handles error when creating MIR fails', async () => {
      const error = new Error('Failed to create MIR');
      (mirService.createMIR as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useLogistics(), { wrapper });

      await act(async () => {
        try {
          await result.current.createMIR({
            mirNumber: 'MIR-001',
            inspectionDate: new Date(),
            inspector: { id: '1', name: 'Inspector', email: 'test@test.com', role: 'Inspector' },
            materials: [],
            overallStatus: 'passed',
            photos: [],
            nonConformances: [],
          });
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error?.message).toBe('Failed to create MIR');
    });
  });
});