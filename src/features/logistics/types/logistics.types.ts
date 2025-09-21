// Type definitions for Logistics, MIR, and IR Management

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  unit: string;
  quantity: number;
  specifications?: string;
}

export interface Delivery {
  id: string;
  deliveryNumber: string;
  vendor: Vendor;
  materials: Material[];
  scheduledDate: Date;
  actualDate?: Date;
  status: 'scheduled' | 'in-transit' | 'delivered' | 'cancelled';
  notes: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Photo {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export interface ChecklistItem {
  id: string;
  description: string;
  checked: boolean;
  result?: 'pass' | 'fail' | 'n/a';
  comments?: string;
}

export interface MaterialInspection {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  checklist: ChecklistItem[];
  status: 'passed' | 'failed' | 'conditional';
  comments: string;
}

export interface NonConformance {
  id: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  correctiveAction?: string;
  status: 'open' | 'closed';
}

export interface MIR {
  id: string;
  mirNumber: string;
  deliveryId?: string;
  inspectionDate: Date;
  inspector: User;
  materials: MaterialInspection[];
  overallStatus: 'passed' | 'failed' | 'conditional';
  photos: Photo[];
  nonConformances: NonConformance[];
  signature?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Finding {
  id: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  category: string;
  photos?: Photo[];
}

export interface CorrectiveAction {
  id: string;
  findingId: string;
  action: string;
  responsiblePerson: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  completionDate?: Date;
}

export interface IR {
  id: string;
  irNumber: string;
  type: 'quality' | 'safety' | 'environmental';
  inspectionDate: Date;
  inspector: User;
  location: string;
  findings: Finding[];
  correctiveActions: CorrectiveAction[];
  status: 'open' | 'closed' | 'pending';
  followUpDate?: Date;
  photos: Photo[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LogisticsMetrics {
  totalDeliveries: number;
  scheduledDeliveries: number;
  completedDeliveries: number;
  totalMIRs: number;
  passedMIRs: number;
  failedMIRs: number;
  totalIRs: number;
  openIRs: number;
  closedIRs: number;
  deliveryOnTimeRate: number;
  averageInspectionTime: number;
  nonConformanceRate: number;
  correctiveActionCompletionRate: number;
  inspectionComplianceRate: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface InspectionTemplate {
  id: string;
  name: string;
  type: string;
  checklist: ChecklistItem[];
  createdAt: Date;
  updatedAt: Date;
}