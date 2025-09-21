import { Delivery, Vendor, Material } from '../types/logistics.types';

// Mock data for development
const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'ABC Construction Supplies',
    contactPerson: 'John Smith',
    email: 'john@abcsupplies.com',
    phone: '+1-234-567-8901',
    address: '123 Industrial Ave, City, State 12345',
  },
  {
    id: '2',
    name: 'XYZ Materials Co.',
    contactPerson: 'Jane Doe',
    email: 'jane@xyzmaterials.com',
    phone: '+1-234-567-8902',
    address: '456 Commerce Blvd, City, State 12346',
  },
];

const mockMaterials: Material[] = [
  {
    id: '1',
    name: 'Concrete Mix',
    description: 'High-strength concrete mix for foundations',
    unit: 'bags',
    quantity: 100,
    specifications: '5000 PSI, 50lb bags',
  },
  {
    id: '2',
    name: 'Steel Rebar',
    description: '#4 reinforcement steel bars',
    unit: 'tons',
    quantity: 5,
    specifications: 'Grade 60, 20ft lengths',
  },
  {
    id: '3',
    name: 'Lumber',
    description: '2x4 pressure treated lumber',
    unit: 'pieces',
    quantity: 500,
    specifications: '8ft lengths, Southern Pine',
  },
];

let mockDeliveries: Delivery[] = [
  {
    id: '1',
    deliveryNumber: 'DEL-2024-001',
    vendor: mockVendors[0],
    materials: [mockMaterials[0], mockMaterials[1]],
    scheduledDate: new Date('2024-01-15'),
    actualDate: new Date('2024-01-15'),
    status: 'delivered',
    notes: 'Delivered on time. All materials in good condition.',
    createdBy: 'user1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    deliveryNumber: 'DEL-2024-002',
    vendor: mockVendors[1],
    materials: [mockMaterials[2]],
    scheduledDate: new Date('2024-01-20'),
    status: 'scheduled',
    notes: 'Lumber delivery for framing work',
    createdBy: 'user1',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
];

// API Service Functions
export const fetchDeliveries = async (): Promise<Delivery[]> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDeliveries);
    }, 500);
  });
};

export const fetchDeliveryById = async (id: string): Promise<Delivery | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const delivery = mockDeliveries.find(d => d.id === id);
      resolve(delivery || null);
    }, 300);
  });
};

export const createDelivery = async (
  delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Delivery> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newDelivery: Delivery = {
        ...delivery,
        id: `${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockDeliveries.push(newDelivery);
      resolve(newDelivery);
    }, 500);
  });
};

export const updateDelivery = async (
  id: string,
  updates: Partial<Delivery>
): Promise<Delivery> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDeliveries.findIndex(d => d.id === id);
      if (index === -1) {
        reject(new Error('Delivery not found'));
        return;
      }
      
      const updatedDelivery: Delivery = {
        ...mockDeliveries[index],
        ...updates,
        updatedAt: new Date(),
      };
      mockDeliveries[index] = updatedDelivery;
      resolve(updatedDelivery);
    }, 500);
  });
};

export const deleteDelivery = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockDeliveries.findIndex(d => d.id === id);
      if (index === -1) {
        reject(new Error('Delivery not found'));
        return;
      }
      
      mockDeliveries = mockDeliveries.filter(d => d.id !== id);
      resolve();
    }, 300);
  });
};

// Helper functions
export const getVendors = async (): Promise<Vendor[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockVendors);
    }, 200);
  });
};

export const getMaterials = async (): Promise<Material[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMaterials);
    }, 200);
  });
};

export const getDeliveryStatistics = async () => {
  const deliveries = await fetchDeliveries();
  
  const stats = {
    total: deliveries.length,
    scheduled: deliveries.filter(d => d.status === 'scheduled').length,
    inTransit: deliveries.filter(d => d.status === 'in-transit').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    cancelled: deliveries.filter(d => d.status === 'cancelled').length,
    onTimeRate: calculateOnTimeRate(deliveries),
  };
  
  return stats;
};

const calculateOnTimeRate = (deliveries: Delivery[]): number => {
  const deliveredOrders = deliveries.filter(d => d.status === 'delivered' && d.actualDate);
  if (deliveredOrders.length === 0) return 0;
  
  const onTimeDeliveries = deliveredOrders.filter(d => 
    d.actualDate && d.actualDate <= d.scheduledDate
  ).length;
  
  return (onTimeDeliveries / deliveredOrders.length) * 100;
};