import { MIR, MaterialInspection, NonConformance, ChecklistItem, InspectionTemplate } from '../types/logistics.types';

// Mock inspection templates
const mockTemplates: InspectionTemplate[] = [
  {
    id: '1',
    name: 'Concrete Inspection',
    type: 'concrete',
    checklist: [
      { id: '1', description: 'Check consistency and workability', checked: false },
      { id: '2', description: 'Verify mix design documentation', checked: false },
      { id: '3', description: 'Check temperature within specifications', checked: false },
      { id: '4', description: 'Perform slump test', checked: false },
      { id: '5', description: 'Take cylinder samples for testing', checked: false },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Steel Inspection',
    type: 'steel',
    checklist: [
      { id: '1', description: 'Verify mill certificates', checked: false },
      { id: '2', description: 'Check dimensions and lengths', checked: false },
      { id: '3', description: 'Inspect for rust or damage', checked: false },
      { id: '4', description: 'Verify grade markings', checked: false },
      { id: '5', description: 'Check bundling and labeling', checked: false },
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

// Mock MIR data
let mockMIRs: MIR[] = [
  {
    id: '1',
    mirNumber: 'MIR-2024-001',
    deliveryId: '1',
    inspectionDate: new Date('2024-01-15'),
    inspector: {
      id: 'user1',
      name: 'John Inspector',
      email: 'john.inspector@company.com',
      role: 'Quality Inspector',
    },
    materials: [
      {
        materialId: '1',
        materialName: 'Concrete Mix',
        quantity: 100,
        unit: 'bags',
        checklist: [
          { id: '1', description: 'Check consistency and workability', checked: true, result: 'pass', comments: 'Good consistency' },
          { id: '2', description: 'Verify mix design documentation', checked: true, result: 'pass', comments: 'Documentation complete' },
          { id: '3', description: 'Check temperature within specifications', checked: true, result: 'pass', comments: 'Temperature: 72°F' },
          { id: '4', description: 'Perform slump test', checked: true, result: 'pass', comments: 'Slump: 4 inches' },
          { id: '5', description: 'Take cylinder samples for testing', checked: true, result: 'pass', comments: '3 samples taken' },
        ],
        status: 'passed',
        comments: 'All concrete bags in good condition. Quality meets specifications.',
      },
    ],
    overallStatus: 'passed',
    photos: [],
    nonConformances: [],
    signature: 'John Inspector',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    mirNumber: 'MIR-2024-002',
    inspectionDate: new Date('2024-01-18'),
    inspector: {
      id: 'user2',
      name: 'Jane QC',
      email: 'jane.qc@company.com',
      role: 'Quality Controller',
    },
    materials: [
      {
        materialId: '2',
        materialName: 'Steel Rebar',
        quantity: 5,
        unit: 'tons',
        checklist: [
          { id: '1', description: 'Verify mill certificates', checked: true, result: 'pass', comments: 'Certificates verified' },
          { id: '2', description: 'Check dimensions and lengths', checked: true, result: 'fail', comments: 'Some bars 2 inches short' },
          { id: '3', description: 'Inspect for rust or damage', checked: true, result: 'pass', comments: 'Minor surface rust acceptable' },
          { id: '4', description: 'Verify grade markings', checked: true, result: 'pass', comments: 'Grade 60 confirmed' },
          { id: '5', description: 'Check bundling and labeling', checked: true, result: 'pass', comments: 'Properly bundled' },
        ],
        status: 'conditional',
        comments: 'Length discrepancy noted. Vendor to provide replacement for short bars.',
      },
    ],
    overallStatus: 'conditional',
    photos: [],
    nonConformances: [
      {
        id: '1',
        description: 'Steel bars 2 inches shorter than specification',
        severity: 'major',
        correctiveAction: 'Vendor to replace affected bars within 3 days',
        status: 'open',
      },
    ],
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
];

// API Service Functions
export const fetchMIRs = async (): Promise<MIR[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockMIRs);
    }, 500);
  });
};

export const fetchMIRById = async (id: string): Promise<MIR | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mir = mockMIRs.find(m => m.id === id);
      resolve(mir || null);
    }, 300);
  });
};

export const createMIR = async (
  mir: Omit<MIR, 'id' | 'createdAt' | 'updatedAt'>
): Promise<MIR> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMIR: MIR = {
        ...mir,
        id: `${Date.now()}`,
        mirNumber: `MIR-${new Date().getFullYear()}-${String(mockMIRs.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockMIRs.push(newMIR);
      resolve(newMIR);
    }, 500);
  });
};

export const updateMIR = async (
  id: string,
  updates: Partial<MIR>
): Promise<MIR> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockMIRs.findIndex(m => m.id === id);
      if (index === -1) {
        reject(new Error('MIR not found'));
        return;
      }
      
      const updatedMIR: MIR = {
        ...mockMIRs[index],
        ...updates,
        updatedAt: new Date(),
      };
      mockMIRs[index] = updatedMIR;
      resolve(updatedMIR);
    }, 500);
  });
};

export const deleteMIR = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockMIRs.findIndex(m => m.id === id);
      if (index === -1) {
        reject(new Error('MIR not found'));
        return;
      }
      
      mockMIRs = mockMIRs.filter(m => m.id !== id);
      resolve();
    }, 300);
  });
};

// Helper functions
export const getInspectionTemplates = async (): Promise<InspectionTemplate[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockTemplates);
    }, 200);
  });
};

export const getTemplateByType = async (type: string): Promise<InspectionTemplate | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const template = mockTemplates.find(t => t.type === type);
      resolve(template || null);
    }, 200);
  });
};

export const getMIRStatistics = async () => {
  const mirs = await fetchMIRs();
  
  const stats = {
    total: mirs.length,
    passed: mirs.filter(m => m.overallStatus === 'passed').length,
    failed: mirs.filter(m => m.overallStatus === 'failed').length,
    conditional: mirs.filter(m => m.overallStatus === 'conditional').length,
    nonConformances: mirs.reduce((acc, mir) => acc + mir.nonConformances.length, 0),
    openNonConformances: mirs.reduce((acc, mir) => 
      acc + mir.nonConformances.filter(nc => nc.status === 'open').length, 0),
  };
  
  return stats;
};

export const addNonConformance = async (
  mirId: string,
  nonConformance: Omit<NonConformance, 'id'>
): Promise<MIR> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mir = mockMIRs.find(m => m.id === mirId);
      if (!mir) {
        reject(new Error('MIR not found'));
        return;
      }
      
      const newNonConformance: NonConformance = {
        ...nonConformance,
        id: `${Date.now()}`,
      };
      
      mir.nonConformances.push(newNonConformance);
      mir.updatedAt = new Date();
      
      // Update overall status if needed
      if (nonConformance.severity === 'critical') {
        mir.overallStatus = 'failed';
      } else if (mir.overallStatus === 'passed') {
        mir.overallStatus = 'conditional';
      }
      
      resolve(mir);
    }, 500);
  });
};