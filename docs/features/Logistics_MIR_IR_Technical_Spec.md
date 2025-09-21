# Technical Specification: Logistics, MIR & IR Management

## Architecture Overview

### Component Structure
```
src/
├── features/
│   └── logistics/
│       ├── components/
│       │   ├── LogisticsDashboard/
│       │   ├── DeliveryScheduler/
│       │   ├── MIRForm/
│       │   ├── IRForm/
│       │   └── InspectionList/
│       ├── hooks/
│       │   ├── useLogistics.ts
│       │   ├── useMIR.ts
│       │   └── useIR.ts
│       ├── services/
│       │   ├── logisticsService.ts
│       │   ├── mirService.ts
│       │   └── irService.ts
│       ├── types/
│       │   └── logistics.types.ts
│       └── __tests__/
```

## Data Models

### Delivery Model
```typescript
interface Delivery {
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
```

### Material Inspection Report (MIR) Model
```typescript
interface MIR {
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

interface MaterialInspection {
  materialId: string;
  materialName: string;
  quantity: number;
  unit: string;
  checklist: ChecklistItem[];
  status: 'passed' | 'failed' | 'conditional';
  comments: string;
}
```

### Inspection Report (IR) Model
```typescript
interface IR {
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

interface Finding {
  id: string;
  description: string;
  severity: 'critical' | 'major' | 'minor';
  category: string;
  photos?: Photo[];
}

interface CorrectiveAction {
  id: string;
  findingId: string;
  action: string;
  responsiblePerson: string;
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed';
  completionDate?: Date;
}
```

## API Endpoints

### Logistics Endpoints
```
GET    /api/logistics/deliveries          - List all deliveries
GET    /api/logistics/deliveries/:id      - Get delivery details
POST   /api/logistics/deliveries          - Create new delivery
PUT    /api/logistics/deliveries/:id      - Update delivery
DELETE /api/logistics/deliveries/:id      - Delete delivery
GET    /api/logistics/dashboard           - Get dashboard data
```

### MIR Endpoints
```
GET    /api/mir                          - List all MIRs
GET    /api/mir/:id                      - Get MIR details
POST   /api/mir                          - Create new MIR
PUT    /api/mir/:id                      - Update MIR
DELETE /api/mir/:id                      - Delete MIR
POST   /api/mir/:id/photos              - Upload photos to MIR
GET    /api/mir/templates                - Get inspection templates
```

### IR Endpoints
```
GET    /api/ir                           - List all IRs
GET    /api/ir/:id                       - Get IR details
POST   /api/ir                           - Create new IR
PUT    /api/ir/:id                       - Update IR
DELETE /api/ir/:id                       - Delete IR
POST   /api/ir/:id/corrective-actions   - Add corrective action
PUT    /api/ir/corrective-actions/:id   - Update corrective action
```

## Component Specifications

### LogisticsDashboard Component
```typescript
interface LogisticsDashboardProps {
  dateRange?: DateRange;
  onDeliveryClick?: (delivery: Delivery) => void;
  onMIRClick?: (mir: MIR) => void;
  onIRClick?: (ir: IR) => void;
}

// Features:
// - Summary cards for key metrics
// - Calendar view of scheduled deliveries
// - Recent MIRs and IRs list
// - Quick action buttons
// - Real-time status updates
```

### MIRForm Component
```typescript
interface MIRFormProps {
  deliveryId?: string;
  onSubmit: (mir: MIR) => Promise<void>;
  onCancel: () => void;
  template?: InspectionTemplate;
}

// Features:
// - Dynamic checklist based on material type
// - Photo upload capability
// - Digital signature capture
// - Offline mode support
// - Auto-save functionality
```

### IRForm Component
```typescript
interface IRFormProps {
  type: 'quality' | 'safety' | 'environmental';
  onSubmit: (ir: IR) => Promise<void>;
  onCancel: () => void;
}

// Features:
// - Finding categorization
// - Severity assessment
// - Corrective action planning
// - Follow-up scheduling
// - Photo documentation
```

## State Management

### Context Structure
```typescript
interface LogisticsContextType {
  deliveries: Delivery[];
  mirs: MIR[];
  irs: IR[];
  loading: boolean;
  error: Error | null;
  
  // Actions
  fetchDeliveries: () => Promise<void>;
  createDelivery: (delivery: Delivery) => Promise<void>;
  updateDelivery: (id: string, updates: Partial<Delivery>) => Promise<void>;
  
  createMIR: (mir: MIR) => Promise<void>;
  updateMIR: (id: string, updates: Partial<MIR>) => Promise<void>;
  
  createIR: (ir: IR) => Promise<void>;
  updateIR: (id: string, updates: Partial<IR>) => Promise<void>;
  addCorrectiveAction: (irId: string, action: CorrectiveAction) => Promise<void>;
}
```

## Testing Strategy

### Unit Tests
- Service layer functions
- Utility functions
- Custom hooks
- Data validators

### Component Tests
- Form submission flows
- Validation error handling
- Photo upload functionality
- Offline mode behavior

### Integration Tests
- Complete MIR creation flow
- IR with corrective actions
- Dashboard data aggregation
- Search and filter functionality

### E2E Tests
- Full inspection workflow
- Offline to online sync
- Report generation
- Notification triggers

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**: Load inspection forms on demand
2. **Virtual Scrolling**: For large inspection lists
3. **Image Optimization**: Compress photos before upload
4. **Caching**: Cache frequently accessed data
5. **Pagination**: Implement server-side pagination

### Offline Support
```typescript
// IndexedDB schema for offline storage
interface OfflineStorage {
  pendingMIRs: MIR[];
  pendingIRs: IR[];
  draftDeliveries: Delivery[];
  cachedTemplates: InspectionTemplate[];
  photoQueue: Photo[];
}
```

## Security Requirements

### Access Control
```typescript
enum Permission {
  VIEW_LOGISTICS = 'view_logistics',
  CREATE_DELIVERY = 'create_delivery',
  CREATE_MIR = 'create_mir',
  CREATE_IR = 'create_ir',
  APPROVE_INSPECTION = 'approve_inspection',
  MANAGE_CORRECTIVE_ACTIONS = 'manage_corrective_actions'
}
```

### Data Validation
- Input sanitization for all forms
- File type validation for photo uploads
- Size limits for attachments
- SQL injection prevention
- XSS protection

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)
- [ ] Set up feature directory structure
- [ ] Create base components
- [ ] Implement data models
- [ ] Set up API services

### Phase 2: Logistics Module (Week 2)
- [ ] Delivery scheduler component
- [ ] Vendor management
- [ ] Status tracking
- [ ] Basic dashboard

### Phase 3: MIR Module (Week 3)
- [ ] MIR form component
- [ ] Photo upload
- [ ] Inspection templates
- [ ] Non-conformance tracking

### Phase 4: IR Module (Week 4)
- [ ] IR form component
- [ ] Finding management
- [ ] Corrective actions
- [ ] Follow-up scheduling

### Phase 5: Integration & Testing (Week 5)
- [ ] Dashboard integration
- [ ] Report generation
- [ ] Comprehensive testing
- [ ] Performance optimization

## Monitoring & Analytics

### Key Metrics
```typescript
interface LogisticsMetrics {
  deliveryOnTimeRate: number;
  averageInspectionTime: number;
  nonConformanceRate: number;
  correctiveActionCompletionRate: number;
  inspectionComplianceRate: number;
}
```

### Logging Strategy
- Log all CRUD operations
- Track user interactions
- Monitor API response times
- Record error occurrences
- Capture offline sync events