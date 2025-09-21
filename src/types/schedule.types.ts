export interface Schedule {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
  milestones: Milestone[];
  baseline: ScheduleBaseline;
  actualProgress: ProgressData[];
  health: ScheduleHealth;
  metadata: ScheduleMetadata;
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  scheduleId: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  dependencies: string[];
  resources: Resource[];
  progress: number;
  status: TaskStatus;
  criticalPath: boolean;
  parentId?: string;
  children?: Task[];
}

export enum TaskStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DELAYED = 'DELAYED',
  ON_HOLD = 'ON_HOLD',
  CANCELLED = 'CANCELLED',
}

export interface Milestone {
  id: string;
  name: string;
  date: Date;
  description?: string;
  status: MilestoneStatus;
  dependencies: string[];
}

export enum MilestoneStatus {
  PENDING = 'PENDING',
  ACHIEVED = 'ACHIEVED',
  MISSED = 'MISSED',
  AT_RISK = 'AT_RISK',
}

export interface ScheduleBaseline {
  id: string;
  name: string;
  createdDate: Date;
  tasks: BaselineTask[];
  totalDuration: number;
  totalCost: number;
}

export interface BaselineTask {
  taskId: string;
  plannedStartDate: Date;
  plannedEndDate: Date;
  plannedDuration: number;
  plannedCost: number;
}

export interface ProgressData {
  date: Date;
  taskId: string;
  percentComplete: number;
  actualCost: number;
  earnedValue: number;
  plannedValue: number;
}

export interface ScheduleHealth {
  overall: number;
  schedule: ScheduleMetrics;
  cost: CostMetrics;
  resource: ResourceMetrics;
  risks: Risk[];
  recommendations: Recommendation[];
  lastCalculated: Date;
}

export interface ScheduleMetrics {
  spi: number; // Schedule Performance Index
  sv: number;  // Schedule Variance
  scheduleHealth: number;
  criticalPathStatus: 'ON_TRACK' | 'AT_RISK' | 'DELAYED';
  delayedTasks: number;
  completedTasks: number;
  totalTasks: number;
  forecastCompletionDate: Date;
}

export interface CostMetrics {
  cpi: number; // Cost Performance Index
  cv: number;  // Cost Variance
  eac: number; // Estimate at Completion
  etc: number; // Estimate to Complete
  budgetHealth: number;
  actualCost: number;
  plannedCost: number;
}

export interface ResourceMetrics {
  utilizationRate: number;
  availableResources: number;
  allocatedResources: number;
  overallocatedResources: number;
  resourceHealth: number;
}

export interface Risk {
  id: string;
  name: string;
  description: string;
  probability: 'LOW' | 'MEDIUM' | 'HIGH';
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  category: RiskCategory;
  mitigationPlan?: string;
  owner?: string;
  dueDate?: Date;
}

export enum RiskCategory {
  SCHEDULE = 'SCHEDULE',
  COST = 'COST',
  RESOURCE = 'RESOURCE',
  QUALITY = 'QUALITY',
  SAFETY = 'SAFETY',
  EXTERNAL = 'EXTERNAL',
}

export interface Recommendation {
  id: string;
  type: RecommendationType;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  title: string;
  description: string;
  impact: string;
  effort: 'LOW' | 'MEDIUM' | 'HIGH';
  taskIds?: string[];
}

export enum RecommendationType {
  ADD_RESOURCES = 'ADD_RESOURCES',
  RESEQUENCE_TASKS = 'RESEQUENCE_TASKS',
  FAST_TRACK = 'FAST_TRACK',
  CRASH_SCHEDULE = 'CRASH_SCHEDULE',
  RISK_MITIGATION = 'RISK_MITIGATION',
  COST_OPTIMIZATION = 'COST_OPTIMIZATION',
}

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  availability: number;
  cost: number;
  skills?: string[];
}

export enum ResourceType {
  LABOR = 'LABOR',
  EQUIPMENT = 'EQUIPMENT',
  MATERIAL = 'MATERIAL',
  SUBCONTRACTOR = 'SUBCONTRACTOR',
}

export interface ScheduleMetadata {
  projectName: string;
  projectManager: string;
  lastModifiedBy: string;
  version: string;
  tags: string[];
}

export interface Deviation {
  id: string;
  scheduleId: string;
  taskId?: string;
  type: DeviationType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  detectedAt: Date;
  daysDelayed?: number;
  costImpact?: number;
  resolved: boolean;
  resolution?: string;
}

export enum DeviationType {
  SCHEDULE_DELAY = 'SCHEDULE_DELAY',
  COST_OVERRUN = 'COST_OVERRUN',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  SCOPE_CHANGE = 'SCOPE_CHANGE',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
}

export interface CriticalPathAnalysis {
  path: string[];
  totalDuration: number;
  criticalTasks: Task[];
  float: { [taskId: string]: number };
  bottlenecks: string[];
}

export interface DelayPrediction {
  taskId: string;
  taskName: string;
  probability: number;
  expectedDelay: number;
  impact: 'LOW' | 'MEDIUM' | 'HIGH';
  causes: string[];
  preventiveMeasures: string[];
}
