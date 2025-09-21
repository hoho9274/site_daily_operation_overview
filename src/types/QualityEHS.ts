export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface QualityAction {
  id: string;
  title: string;
  description: string;
  category: 'quality' | 'safety' | 'environmental';
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignee: User;
  dueDate: Date;
  attachments: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EHSIncident {
  id: string;
  type: 'safety' | 'health' | 'environmental';
  severity: 'minor' | 'moderate' | 'major' | 'critical';
  description: string;
  location: string;
  reportedBy: User;
  witnesses: User[];
  actions: QualityAction[];
  status: 'reported' | 'investigating' | 'resolved';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface QualityMetrics {
  totalActions: number;
  openActions: number;
  overdueActions: number;
  completionRate: number;
  averageResolutionTime: number;
}

export interface SafetyMetrics {
  totalIncidents: number;
  openIncidents: number;
  daysWithoutIncident: number;
  incidentFrequencyRate: number;
  severityDistribution: {
    minor: number;
    moderate: number;
    major: number;
    critical: number;
  };
}

export interface ComplianceStatus {
  overallCompliance: number;
  categories: {
    quality: number;
    safety: number;
    environmental: number;
  };
  upcomingAudits: Array<{
    id: string;
    name: string;
    date: Date;
    type: string;
  }>;
  recentInspections: Array<{
    id: string;
    name: string;
    date: Date;
    result: 'pass' | 'fail' | 'conditional';
  }>;
}