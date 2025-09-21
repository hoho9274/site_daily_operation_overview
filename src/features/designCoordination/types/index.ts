// Document Types
export interface Document {
  id: string;
  projectId: string;
  name: string;
  type: DocumentType;
  discipline?: Discipline;
  fileUrl: string;
  fileSize: number;
  version: number;
  parentId?: string;
  uploadedBy: string;
  uploadedByName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentType {
  PDF = 'pdf',
  DWG = 'dwg',
  DXF = 'dxf',
  IMAGE = 'image',
  OTHER = 'other'
}

export enum Discipline {
  ARCHITECTURAL = 'architectural',
  STRUCTURAL = 'structural',
  MEP = 'mep',
  CIVIL = 'civil',
  LANDSCAPE = 'landscape'
}

// RFI Types
export interface RFI {
  id: string;
  projectId: string;
  rfiNumber: string;
  title: string;
  description?: string;
  status: RFIStatus;
  priority: Priority;
  createdBy: string;
  createdByName?: string;
  assignedTo?: string;
  assignedToName?: string;
  dueDate?: Date;
  respondedAt?: Date;
  response?: string;
  attachments?: RFIAttachment[];
  comments?: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RFIAttachment {
  id: string;
  rfiId: string;
  documentId?: string;
  fileUrl?: string;
  fileName: string;
  createdAt: Date;
}

export enum RFIStatus {
  OPEN = 'open',
  IN_REVIEW = 'in_review',
  RESPONDED = 'responded',
  CLOSED = 'closed'
}

export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Design Issue Types
export interface DesignIssue {
  id: string;
  projectId: string;
  issueNumber: string;
  title: string;
  description?: string;
  type?: IssueType;
  severity: Severity;
  status: IssueStatus;
  costImpact?: number;
  scheduleImpact?: number;
  assignedTo?: string;
  assignedToName?: string;
  resolvedAt?: Date;
  resolution?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum IssueType {
  CONFLICT = 'conflict',
  MISSING_INFO = 'missing_info',
  ERROR = 'error',
  CLARIFICATION = 'clarification'
}

export enum Severity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum IssueStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

// Comment Type
export interface Comment {
  id: string;
  entityType: 'rfi' | 'issue' | 'document';
  entityId: string;
  userId: string;
  userName?: string;
  content: string;
  parentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Dashboard Types
export interface DashboardStats {
  totalDocuments: number;
  totalRFIs: number;
  openRFIs: number;
  totalIssues: number;
  openIssues: number;
  criticalItems: number;
  avgResponseTime: number;
  recentActivities: Activity[];
}

export interface Activity {
  id: string;
  type: 'document_upload' | 'rfi_created' | 'rfi_responded' | 'issue_created' | 'issue_resolved';
  title: string;
  description: string;
  userId: string;
  userName: string;
  timestamp: Date;
}

// Filter Types
export interface DocumentFilters {
  search?: string;
  type?: DocumentType;
  discipline?: Discipline;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface RFIFilters {
  search?: string;
  status?: RFIStatus;
  priority?: Priority;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface IssueFilters {
  search?: string;
  type?: IssueType;
  severity?: Severity;
  status?: IssueStatus;
  assignedTo?: string;
  dateFrom?: Date;
  dateTo?: Date;
}