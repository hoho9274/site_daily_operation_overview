# Schedule Health Feature - Technical Specification

## Feature Overview

The Schedule Health feature provides comprehensive monitoring and analysis of project schedules, offering real-time insights into schedule performance, deviations, and predictive analytics for potential delays.

## Technical Requirements

### Frontend Components

#### 1. ScheduleHealthDashboard Component
```typescript
interface ScheduleHealthDashboardProps {
  projectId: string;
  scheduleId?: string;
  viewMode: 'summary' | 'detailed' | 'analytics';
  dateRange?: DateRange;
}

// Main dashboard component
const ScheduleHealthDashboard: React.FC<ScheduleHealthDashboardProps>
```

#### 2. ScheduleMetrics Component
```typescript
interface MetricsData {
  spi: number; // Schedule Performance Index
  cpi: number; // Cost Performance Index
  sv: number;  // Schedule Variance
  cv: number;  // Cost Variance
  eac: number; // Estimate at Completion
  etc: number; // Estimate to Complete
}

const ScheduleMetrics: React.FC<{ metrics: MetricsData }>
```

#### 3. GanttChart Component
```typescript
interface GanttChartProps {
  tasks: Task[];
  milestones: Milestone[];
  criticalPath: string[];
  onTaskClick: (taskId: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

const GanttChart: React.FC<GanttChartProps>
```

#### 4. DeviationAnalyzer Component
```typescript
interface DeviationAnalyzerProps {
  deviations: Deviation[];
  thresholds: DeviationThresholds;
  onDeviationSelect: (deviation: Deviation) => void;
}

const DeviationAnalyzer: React.FC<DeviationAnalyzerProps>
```

### State Management

#### Redux Store Structure
```typescript
interface ScheduleHealthState {
  schedules: {
    items: Schedule[];
    selectedId: string | null;
    loading: boolean;
    error: Error | null;
  };
  health: {
    metrics: ScheduleHealthMetrics;
    deviations: Deviation[];
    predictions: Prediction[];
    lastUpdated: Date;
  };
  filters: {
    dateRange: DateRange;
    taskStatus: TaskStatus[];
    showCriticalOnly: boolean;
  };
  ui: {
    viewMode: ViewMode;
    expandedSections: string[];
    selectedTaskId: string | null;
  };
}
```

#### Actions
```typescript
// Schedule actions
export const fetchSchedule = createAsyncThunk(
  'schedules/fetch',
  async (scheduleId: string) => {
    return await scheduleAPI.getSchedule(scheduleId);
  }
);

export const updateTask = createAsyncThunk(
  'schedules/updateTask',
  async ({ scheduleId, taskId, updates }: UpdateTaskPayload) => {
    return await scheduleAPI.updateTask(scheduleId, taskId, updates);
  }
);

// Health actions
export const calculateHealth = createAsyncThunk(
  'health/calculate',
  async (scheduleId: string) => {
    return await healthAPI.calculateHealth(scheduleId);
  }
);

export const detectDeviations = createAsyncThunk(
  'health/detectDeviations',
  async (scheduleId: string) => {
    return await healthAPI.detectDeviations(scheduleId);
  }
);
```

### API Implementation

#### Schedule Health Service
```typescript
class ScheduleHealthService {
  private readonly baseURL = '/api/v1/schedule-health';
  
  async getScheduleHealth(scheduleId: string): Promise<ScheduleHealth> {
    const response = await fetch(`${this.baseURL}/${scheduleId}/health`);
    return response.json();
  }
  
  async calculateMetrics(scheduleId: string): Promise<ScheduleMetrics> {
    const response = await fetch(`${this.baseURL}/${scheduleId}/metrics`, {
      method: 'POST',
    });
    return response.json();
  }
  
  async getDeviations(
    scheduleId: string,
    params?: DeviationParams
  ): Promise<Deviation[]> {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${this.baseURL}/${scheduleId}/deviations?${queryString}`
    );
    return response.json();
  }
  
  async predictDelays(
    scheduleId: string,
    params: PredictionParams
  ): Promise<DelayPrediction[]> {
    const response = await fetch(`${this.baseURL}/${scheduleId}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return response.json();
  }
  
  async getCriticalPath(scheduleId: string): Promise<CriticalPath> {
    const response = await fetch(
      `${this.baseURL}/${scheduleId}/critical-path`
    );
    return response.json();
  }
}
```

### Backend Implementation

#### Database Schema
```sql
-- Schedules table
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  baseline_id UUID REFERENCES schedule_baselines(id),
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration INTEGER NOT NULL,
  progress DECIMAL(5,2) DEFAULT 0,
  status VARCHAR(50) NOT NULL,
  is_critical BOOLEAN DEFAULT FALSE,
  parent_id UUID REFERENCES tasks(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task dependencies
CREATE TABLE task_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  predecessor_id UUID NOT NULL REFERENCES tasks(id),
  successor_id UUID NOT NULL REFERENCES tasks(id),
  dependency_type VARCHAR(20) NOT NULL, -- FS, SS, SF, FF
  lag_days INTEGER DEFAULT 0
);

-- Schedule health metrics
CREATE TABLE schedule_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id),
  calculated_at TIMESTAMP NOT NULL,
  overall_health DECIMAL(5,2),
  spi DECIMAL(5,3),
  cpi DECIMAL(5,3),
  sv DECIMAL(12,2),
  cv DECIMAL(12,2),
  eac DECIMAL(12,2),
  etc DECIMAL(12,2),
  forecast_completion DATE,
  risk_score DECIMAL(5,2)
);

-- Schedule deviations
CREATE TABLE schedule_deviations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id),
  task_id UUID REFERENCES tasks(id),
  deviation_type VARCHAR(50) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  days_delayed INTEGER,
  cost_impact DECIMAL(12,2),
  description TEXT,
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved BOOLEAN DEFAULT FALSE
);
```

#### API Controllers
```typescript
@Controller('schedule-health')
export class ScheduleHealthController {
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly healthService: ScheduleHealthService,
  ) {}
  
  @Get(':id/health')
  async getScheduleHealth(@Param('id') scheduleId: string) {
    return await this.healthService.calculateHealth(scheduleId);
  }
  
  @Get(':id/metrics')
  async getMetrics(@Param('id') scheduleId: string) {
    return await this.healthService.calculateMetrics(scheduleId);
  }
  
  @Get(':id/deviations')
  async getDeviations(
    @Param('id') scheduleId: string,
    @Query() params: DeviationQueryDto,
  ) {
    return await this.healthService.detectDeviations(scheduleId, params);
  }
  
  @Post(':id/predict')
  async predictDelays(
    @Param('id') scheduleId: string,
    @Body() params: PredictionParamsDto,
  ) {
    return await this.healthService.predictDelays(scheduleId, params);
  }
  
  @Get(':id/critical-path')
  async getCriticalPath(@Param('id') scheduleId: string) {
    return await this.healthService.analyzeCriticalPath(scheduleId);
  }
}
```

#### Health Calculation Engine
```typescript
export class ScheduleHealthEngine {
  calculateOverallHealth(schedule: Schedule): number {
    const spi = this.calculateSPI(schedule);
    const cpi = this.calculateCPI(schedule);
    const riskScore = this.calculateRiskScore(schedule);
    const resourceUtilization = this.calculateResourceUtilization(schedule);
    
    // Weighted calculation
    const health = (
      spi * 0.35 +
      cpi * 0.25 +
      (1 - riskScore) * 0.25 +
      resourceUtilization * 0.15
    ) * 100;
    
    return Math.min(100, Math.max(0, health));
  }
  
  calculateSPI(schedule: Schedule): number {
    const earnedValue = this.calculateEarnedValue(schedule);
    const plannedValue = this.calculatePlannedValue(schedule);
    
    return plannedValue > 0 ? earnedValue / plannedValue : 0;
  }
  
  calculateCPI(schedule: Schedule): number {
    const earnedValue = this.calculateEarnedValue(schedule);
    const actualCost = this.calculateActualCost(schedule);
    
    return actualCost > 0 ? earnedValue / actualCost : 0;
  }
  
  detectDeviations(schedule: Schedule): Deviation[] {
    const deviations: Deviation[] = [];
    
    for (const task of schedule.tasks) {
      // Check schedule deviations
      const scheduleDev = this.checkScheduleDeviation(task);
      if (scheduleDev) deviations.push(scheduleDev);
      
      // Check cost deviations
      const costDev = this.checkCostDeviation(task);
      if (costDev) deviations.push(costDev);
      
      // Check resource deviations
      const resourceDev = this.checkResourceDeviation(task);
      if (resourceDev) deviations.push(resourceDev);
    }
    
    return deviations;
  }
  
  analyzeCriticalPath(schedule: Schedule): CriticalPathAnalysis {
    const network = this.buildNetworkDiagram(schedule);
    const criticalPath = this.calculateCriticalPath(network);
    const float = this.calculateFloat(network);
    
    return {
      path: criticalPath,
      totalDuration: this.calculatePathDuration(criticalPath),
      criticalTasks: criticalPath.map(id => 
        schedule.tasks.find(t => t.id === id)
      ),
      float: float,
    };
  }
}
```

### Real-time Updates

#### WebSocket Implementation
```typescript
@WebSocketGateway()
export class ScheduleHealthGateway {
  @WebSocketServer()
  server: Server;
  
  @SubscribeMessage('subscribeSchedule')
  handleSubscription(
    @MessageBody() scheduleId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`schedule:${scheduleId}`);
    return { event: 'subscribed', scheduleId };
  }
  
  @SubscribeMessage('unsubscribeSchedule')
  handleUnsubscription(
    @MessageBody() scheduleId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`schedule:${scheduleId}`);
    return { event: 'unsubscribed', scheduleId };
  }
  
  emitScheduleUpdate(scheduleId: string, update: ScheduleUpdate) {
    this.server.to(`schedule:${scheduleId}`).emit('scheduleUpdate', update);
  }
  
  emitHealthUpdate(scheduleId: string, health: ScheduleHealth) {
    this.server.to(`schedule:${scheduleId}`).emit('healthUpdate', health);
  }
  
  emitDeviationAlert(scheduleId: string, deviation: Deviation) {
    this.server.to(`schedule:${scheduleId}`).emit('deviationAlert', deviation);
  }
}
```

#### Client WebSocket Hook
```typescript
export const useScheduleWebSocket = (scheduleId: string) => {
  const [connected, setConnected] = useState(false);
  const [updates, setUpdates] = useState<ScheduleUpdate[]>([]);
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    const socket = io('/schedule-health');
    
    socket.on('connect', () => {
      setConnected(true);
      socket.emit('subscribeSchedule', scheduleId);
    });
    
    socket.on('scheduleUpdate', (update: ScheduleUpdate) => {
      setUpdates(prev => [...prev, update]);
      dispatch(scheduleActions.applyUpdate(update));
    });
    
    socket.on('healthUpdate', (health: ScheduleHealth) => {
      dispatch(healthActions.updateHealth(health));
    });
    
    socket.on('deviationAlert', (deviation: Deviation) => {
      dispatch(alertActions.showDeviation(deviation));
    });
    
    socket.on('disconnect', () => {
      setConnected(false);
    });
    
    return () => {
      socket.emit('unsubscribeSchedule', scheduleId);
      socket.disconnect();
    };
  }, [scheduleId, dispatch]);
  
  return { connected, updates };
};
```

### Testing Requirements

#### Unit Tests
```typescript
describe('ScheduleHealthEngine', () => {
  let engine: ScheduleHealthEngine;
  let mockSchedule: Schedule;
  
  beforeEach(() => {
    engine = new ScheduleHealthEngine();
    mockSchedule = createMockSchedule();
  });
  
  describe('calculateOverallHealth', () => {
    it('should calculate health score correctly', () => {
      const health = engine.calculateOverallHealth(mockSchedule);
      expect(health).toBeGreaterThanOrEqual(0);
      expect(health).toBeLessThanOrEqual(100);
    });
    
    it('should handle empty schedule', () => {
      const emptySchedule = { ...mockSchedule, tasks: [] };
      const health = engine.calculateOverallHealth(emptySchedule);
      expect(health).toBe(0);
    });
  });
  
  describe('detectDeviations', () => {
    it('should detect schedule deviations', () => {
      const deviations = engine.detectDeviations(mockSchedule);
      expect(deviations).toHaveLength(2);
      expect(deviations[0].type).toBe('SCHEDULE_DELAY');
    });
    
    it('should detect cost overruns', () => {
      const deviations = engine.detectDeviations(mockSchedule);
      const costDeviation = deviations.find(d => d.type === 'COST_OVERRUN');
      expect(costDeviation).toBeDefined();
      expect(costDeviation.severity).toBe('HIGH');
    });
  });
});
```

#### Integration Tests
```typescript
describe('Schedule Health API', () => {
  let app: INestApplication;
  
  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    
    app = moduleFixture.createNestApplication();
    await app.init();
  });
  
  describe('/schedule-health/:id/health (GET)', () => {
    it('should return schedule health metrics', async () => {
      const response = await request(app.getHttpServer())
        .get('/schedule-health/123/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('overall');
      expect(response.body).toHaveProperty('metrics');
      expect(response.body).toHaveProperty('deviations');
    });
  });
  
  describe('/schedule-health/:id/predict (POST)', () => {
    it('should return delay predictions', async () => {
      const params = {
        horizon: 30,
        confidence: 0.95,
        includeRisks: true,
      };
      
      const response = await request(app.getHttpServer())
        .post('/schedule-health/123/predict')
        .send(params)
        .expect(200);
      
      expect(response.body).toBeArray();
      expect(response.body[0]).toHaveProperty('taskId');
      expect(response.body[0]).toHaveProperty('probability');
      expect(response.body[0]).toHaveProperty('expectedDelay');
    });
  });
});
```

### Performance Optimization

#### Caching Strategy
```typescript
@Injectable()
export class ScheduleHealthCache {
  constructor(
    @InjectRedis() private readonly redis: Redis,
  ) {}
  
  async getHealth(scheduleId: string): Promise<ScheduleHealth | null> {
    const cached = await this.redis.get(`health:${scheduleId}`);
    return cached ? JSON.parse(cached) : null;
  }
  
  async setHealth(
    scheduleId: string,
    health: ScheduleHealth,
    ttl: number = 300,
  ): Promise<void> {
    await this.redis.setex(
      `health:${scheduleId}`,
      ttl,
      JSON.stringify(health),
    );
  }
  
  async invalidate(scheduleId: string): Promise<void> {
    await this.redis.del(`health:${scheduleId}`);
  }
}
```

#### Query Optimization
```sql
-- Optimized query for schedule metrics with indexes
CREATE INDEX idx_tasks_schedule_status ON tasks(schedule_id, status);
CREATE INDEX idx_tasks_critical ON tasks(schedule_id, is_critical) WHERE is_critical = true;
CREATE INDEX idx_dependencies_successor ON task_dependencies(successor_id);
CREATE INDEX idx_health_metrics_schedule ON schedule_health_metrics(schedule_id, calculated_at DESC);

-- Materialized view for performance metrics
CREATE MATERIALIZED VIEW schedule_performance_summary AS
SELECT 
  s.id,
  s.name,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) as completed_tasks,
  AVG(t.progress) as avg_progress,
  MAX(CASE WHEN t.is_critical THEN t.end_date END) as critical_end_date,
  (
    SELECT shm.overall_health 
    FROM schedule_health_metrics shm 
    WHERE shm.schedule_id = s.id 
    ORDER BY shm.calculated_at DESC 
    LIMIT 1
  ) as latest_health_score
FROM schedules s
LEFT JOIN tasks t ON t.schedule_id = s.id
GROUP BY s.id, s.name;

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_schedule_summary()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY schedule_performance_summary;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER refresh_summary_on_task_change
AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_schedule_summary();
```

### Error Handling

#### Error Types
```typescript
export class ScheduleHealthError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'ScheduleHealthError';
  }
}

export class ScheduleNotFoundError extends ScheduleHealthError {
  constructor(scheduleId: string) {
    super(
      `Schedule ${scheduleId} not found`,
      'SCHEDULE_NOT_FOUND',
      404,
    );
  }
}

export class InsufficientDataError extends ScheduleHealthError {
  constructor(dataType: string) {
    super(
      `Insufficient ${dataType} data for health calculation`,
      'INSUFFICIENT_DATA',
      400,
    );
  }
}

export class CalculationError extends ScheduleHealthError {
  constructor(metric: string, reason: string) {
    super(
      `Failed to calculate ${metric}: ${reason}`,
      'CALCULATION_ERROR',
      500,
    );
  }
}
```

#### Error Handler
```typescript
@Catch(ScheduleHealthError)
export class ScheduleHealthErrorFilter implements ExceptionFilter {
  catch(exception: ScheduleHealthError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    
    response.status(exception.statusCode).json({
      error: {
        code: exception.code,
        message: exception.message,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
```

### Monitoring & Logging

#### Metrics Collection
```typescript
@Injectable()
export class ScheduleHealthMetrics {
  private readonly healthCalculationDuration = new Histogram({
    name: 'schedule_health_calculation_duration_seconds',
    help: 'Duration of health calculation operations',
    labelNames: ['schedule_id', 'status'],
  });
  
  private readonly deviationCount = new Counter({
    name: 'schedule_deviations_total',
    help: 'Total number of schedule deviations detected',
    labelNames: ['schedule_id', 'severity', 'type'],
  });
  
  private readonly healthScore = new Gauge({
    name: 'schedule_health_score',
    help: 'Current health score of schedules',
    labelNames: ['schedule_id', 'project_id'],
  });
  
  recordHealthCalculation(
    scheduleId: string,
    duration: number,
    status: 'success' | 'failure',
  ) {
    this.healthCalculationDuration
      .labels(scheduleId, status)
      .observe(duration);
  }
  
  recordDeviation(
    scheduleId: string,
    severity: string,
    type: string,
  ) {
    this.deviationCount.labels(scheduleId, severity, type).inc();
  }
  
  updateHealthScore(
    scheduleId: string,
    projectId: string,
    score: number,
  ) {
    this.healthScore.labels(scheduleId, projectId).set(score);
  }
}
```

### Deployment Configuration

#### Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Kubernetes Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: schedule-health-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: schedule-health
  template:
    metadata:
      labels:
        app: schedule-health
    spec:
      containers:
      - name: schedule-health
        image: construction/schedule-health:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: redis-secret
              key: url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```