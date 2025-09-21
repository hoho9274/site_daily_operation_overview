import { IR, Finding, CorrectiveAction } from '../types/logistics.types';

// Mock IR data
let mockIRs: IR[] = [
  {
    id: '1',
    irNumber: 'IR-2024-001',
    type: 'safety',
    inspectionDate: new Date('2024-01-14'),
    inspector: {
      id: 'user1',
      name: 'Mike Safety',
      email: 'mike.safety@company.com',
      role: 'Safety Inspector',
    },
    location: 'Construction Site - Block A',
    findings: [
      {
        id: '1',
        description: 'Workers not wearing hard hats in designated area',
        severity: 'major',
        category: 'PPE Compliance',
        photos: [],
      },
      {
        id: '2',
        description: 'Emergency exit blocked by materials',
        severity: 'critical',
        category: 'Emergency Access',
        photos: [],
      },
    ],
    correctiveActions: [
      {
        id: '1',
        findingId: '1',
        action: 'Conduct safety briefing and enforce PPE policy',
        responsiblePerson: 'Site Supervisor',
        dueDate: new Date('2024-01-16'),
        status: 'completed',
        completionDate: new Date('2024-01-15'),
      },
      {
        id: '2',
        findingId: '2',
        action: 'Clear emergency exit immediately and mark keep-clear zones',
        responsiblePerson: 'Site Manager',
        dueDate: new Date('2024-01-14'),
        status: 'completed',
        completionDate: new Date('2024-01-14'),
      },
    ],
    status: 'closed',
    followUpDate: new Date('2024-01-21'),
    photos: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    irNumber: 'IR-2024-002',
    type: 'quality',
    inspectionDate: new Date('2024-01-17'),
    inspector: {
      id: 'user2',
      name: 'Sarah Quality',
      email: 'sarah.quality@company.com',
      role: 'Quality Inspector',
    },
    location: 'Foundation Work - Section 2',
    findings: [
      {
        id: '1',
        description: 'Concrete cover for reinforcement below specification',
        severity: 'major',
        category: 'Structural',
        photos: [],
      },
      {
        id: '2',
        description: 'Surface finishing not meeting standards',
        severity: 'minor',
        category: 'Finishing',
        photos: [],
      },
    ],
    correctiveActions: [
      {
        id: '1',
        findingId: '1',
        action: 'Add spacers and re-inspect before concrete pour',
        responsiblePerson: 'Concrete Foreman',
        dueDate: new Date('2024-01-19'),
        status: 'in-progress',
      },
      {
        id: '2',
        findingId: '2',
        action: 'Re-train crew on finishing techniques',
        responsiblePerson: 'Training Coordinator',
        dueDate: new Date('2024-01-24'),
        status: 'pending',
      },
    ],
    status: 'open',
    followUpDate: new Date('2024-01-20'),
    photos: [],
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '3',
    irNumber: 'IR-2024-003',
    type: 'environmental',
    inspectionDate: new Date('2024-01-19'),
    inspector: {
      id: 'user3',
      name: 'Tom Environmental',
      email: 'tom.env@company.com',
      role: 'Environmental Officer',
    },
    location: 'Site Perimeter',
    findings: [
      {
        id: '1',
        description: 'Sediment control measures inadequate',
        severity: 'major',
        category: 'Erosion Control',
        photos: [],
      },
      {
        id: '2',
        description: 'Waste segregation not properly implemented',
        severity: 'minor',
        category: 'Waste Management',
        photos: [],
      },
    ],
    correctiveActions: [
      {
        id: '1',
        findingId: '1',
        action: 'Install additional silt fencing and sediment traps',
        responsiblePerson: 'Environmental Coordinator',
        dueDate: new Date('2024-01-21'),
        status: 'pending',
      },
    ],
    status: 'pending',
    followUpDate: new Date('2024-01-25'),
    photos: [],
    createdAt: new Date('2024-01-19'),
    updatedAt: new Date('2024-01-19'),
  },
];

// API Service Functions
export const fetchIRs = async (): Promise<IR[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockIRs);
    }, 500);
  });
};

export const fetchIRById = async (id: string): Promise<IR | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const ir = mockIRs.find(i => i.id === id);
      resolve(ir || null);
    }, 300);
  });
};

export const createIR = async (
  ir: Omit<IR, 'id' | 'createdAt' | 'updatedAt'>
): Promise<IR> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newIR: IR = {
        ...ir,
        id: `${Date.now()}`,
        irNumber: `IR-${new Date().getFullYear()}-${String(mockIRs.length + 1).padStart(3, '0')}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockIRs.push(newIR);
      resolve(newIR);
    }, 500);
  });
};

export const updateIR = async (
  id: string,
  updates: Partial<IR>
): Promise<IR> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockIRs.findIndex(i => i.id === id);
      if (index === -1) {
        reject(new Error('IR not found'));
        return;
      }
      
      const updatedIR: IR = {
        ...mockIRs[index],
        ...updates,
        updatedAt: new Date(),
      };
      mockIRs[index] = updatedIR;
      resolve(updatedIR);
    }, 500);
  });
};

export const deleteIR = async (id: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockIRs.findIndex(i => i.id === id);
      if (index === -1) {
        reject(new Error('IR not found'));
        return;
      }
      
      mockIRs = mockIRs.filter(i => i.id !== id);
      resolve();
    }, 300);
  });
};

// Corrective Action Management
export const addCorrectiveAction = async (
  irId: string,
  action: Omit<CorrectiveAction, 'id'>
): Promise<IR> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ir = mockIRs.find(i => i.id === irId);
      if (!ir) {
        reject(new Error('IR not found'));
        return;
      }
      
      const newAction: CorrectiveAction = {
        ...action,
        id: `${Date.now()}`,
      };
      
      ir.correctiveActions.push(newAction);
      ir.updatedAt = new Date();
      
      resolve(ir);
    }, 500);
  });
};

export const updateCorrectiveAction = async (
  irId: string,
  actionId: string,
  updates: Partial<CorrectiveAction>
): Promise<IR> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ir = mockIRs.find(i => i.id === irId);
      if (!ir) {
        reject(new Error('IR not found'));
        return;
      }
      
      const actionIndex = ir.correctiveActions.findIndex(a => a.id === actionId);
      if (actionIndex === -1) {
        reject(new Error('Corrective action not found'));
        return;
      }
      
      ir.correctiveActions[actionIndex] = {
        ...ir.correctiveActions[actionIndex],
        ...updates,
      };
      ir.updatedAt = new Date();
      
      // Check if all actions are completed to potentially close the IR
      const allCompleted = ir.correctiveActions.every(a => a.status === 'completed');
      if (allCompleted) {
        ir.status = 'closed';
      }
      
      resolve(ir);
    }, 500);
  });
};

// Helper functions
export const getIRStatistics = async () => {
  const irs = await fetchIRs();
  
  const stats = {
    total: irs.length,
    open: irs.filter(i => i.status === 'open').length,
    closed: irs.filter(i => i.status === 'closed').length,
    pending: irs.filter(i => i.status === 'pending').length,
    byType: {
      quality: irs.filter(i => i.type === 'quality').length,
      safety: irs.filter(i => i.type === 'safety').length,
      environmental: irs.filter(i => i.type === 'environmental').length,
    },
    totalFindings: irs.reduce((acc, ir) => acc + ir.findings.length, 0),
    findingsBySeverity: {
      critical: irs.reduce((acc, ir) => 
        acc + ir.findings.filter(f => f.severity === 'critical').length, 0),
      major: irs.reduce((acc, ir) => 
        acc + ir.findings.filter(f => f.severity === 'major').length, 0),
      minor: irs.reduce((acc, ir) => 
        acc + ir.findings.filter(f => f.severity === 'minor').length, 0),
    },
    totalCorrectiveActions: irs.reduce((acc, ir) => acc + ir.correctiveActions.length, 0),
    correctiveActionsByStatus: {
      pending: irs.reduce((acc, ir) => 
        acc + ir.correctiveActions.filter(ca => ca.status === 'pending').length, 0),
      inProgress: irs.reduce((acc, ir) => 
        acc + ir.correctiveActions.filter(ca => ca.status === 'in-progress').length, 0),
      completed: irs.reduce((acc, ir) => 
        acc + ir.correctiveActions.filter(ca => ca.status === 'completed').length, 0),
    },
  };
  
  return stats;
};

export const getUpcomingFollowUps = async (): Promise<IR[]> => {
  const irs = await fetchIRs();
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  return irs.filter(ir => 
    ir.followUpDate && 
    ir.followUpDate >= today && 
    ir.followUpDate <= nextWeek &&
    ir.status !== 'closed'
  );
};

export const getOverdueCorrectiveActions = async (): Promise<{ir: IR, action: CorrectiveAction}[]> => {
  const irs = await fetchIRs();
  const today = new Date();
  const overdueActions: {ir: IR, action: CorrectiveAction}[] = [];
  
  irs.forEach(ir => {
    ir.correctiveActions.forEach(action => {
      if (action.status !== 'completed' && action.dueDate < today) {
        overdueActions.push({ ir, action });
      }
    });
  });
  
  return overdueActions;
};