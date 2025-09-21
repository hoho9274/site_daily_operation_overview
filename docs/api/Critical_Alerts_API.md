# Critical Alerts API

## Overview

The Critical Alerts API provides endpoints for managing and interacting with critical alerts in construction projects. Alerts are automatically generated based on SLA thresholds, impact scores, and critical path dependencies.

## Endpoints

### GET /projects/{projectId}/alerts

Retrieve critical alerts for a project with filtering and sorting options.

**Parameters:**
- `projectId` (path, required): Project identifier
- `types` (query, optional): Comma-separated alert types (RFI,IR,MIR,CHANGE,PUNCH,PERMIT)
- `impactMin` (query, optional): Minimum impact score (0-3.25)
- `dueWithinHours` (query, optional): Alerts due within specified hours
- `sort` (query, optional): Sort field (rank, remainingSeconds, impact)
- `limit` (query, optional): Maximum number of results (default: 50)
- `offset` (query, optional): Number of results to skip (default: 0)

**Example Request:**
```http
GET /projects/proj-123/alerts?types=RFI,IR&impactMin=2.0&dueWithinHours=24&sort=rank&limit=20
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "projectId": "proj-123",
  "asOf": "2025-09-21T10:30:00Z",
  "kpis": {
    "newOverdue": 7,
    "due24h": 12,
    "autoEscalations": 4
  },
  "items": [
    {
      "id": "RFI-214",
      "type": "RFI",
      "title": "B2 柱筋與管道碰撞（請求設計澄清）",
      "remainingSeconds": -21600,
      "slaLevel": "critical",
      "impact": {
        "cp": 3,
        "cost": 2,
        "stop": 1,
        "ehs": 0,
        "total": 2.35
      },
      "owner": "顧問A",
      "wbsId": "3.2.1",
      "locationId": "B2-Grid C5",
      "drawingVersionId": "A-201-vB",
      "relatedIds": ["ME-079"],
      "rank": 2.91,
      "actionsAllowed": ["REMIND", "ESCALATE", "MEETING", "CONVERT_CHANGE"],
      "createdAt": "2025-09-20T14:30:00Z",
      "updatedAt": "2025-09-21T08:15:00Z"
    }
  ]
}
```

### GET /alerts/{alertId}

Retrieve detailed information about a specific alert including timeline and evidence.

**Parameters:**
- `alertId` (path, required): Alert identifier

**Example Request:**
```http
GET /alerts/RFI-214
Authorization: Bearer <token>
```

**Example Response:**
```json
{
  "id": "RFI-214",
  "type": "RFI",
  "title": "B2 柱筋與管道碰撞（請求設計澄清）",
  "remainingSeconds": -21600,
  "slaLevel": "critical",
  "impact": {
    "cp": 3,
    "cost": 2,
    "stop": 1,
    "ehs": 0,
    "total": 2.35
  },
  "owner": "顧問A",
  "wbsId": "3.2.1",
  "locationId": "B2-Grid C5",
  "drawingVersionId": "A-201-vB",
  "relatedIds": ["ME-079"],
  "rank": 2.91,
  "actionsAllowed": ["REMIND", "ESCALATE", "MEETING", "CONVERT_CHANGE"],
  "timeline": [
    {
      "id": "timeline-1",
      "at": "2025-09-20T14:30:00Z",
      "actor": "工程師張",
      "kind": "CREATE",
      "payload": {
        "description": "RFI created for column reinforcement conflict"
      }
    },
    {
      "id": "timeline-2",
      "at": "2025-09-21T08:15:00Z",
      "actor": "系統",
      "kind": "ESCALATE",
      "payload": {
        "reason": "Auto-escalation due to critical path impact"
      }
    }
  ],
  "evidence": [
    {
      "id": "evidence-1",
      "type": "PHOTO",
      "url": "https://files.construction-hub.com/photos/rfi-214-conflict.jpg",
      "hash": "sha256:abc123...",
      "createdAt": "2025-09-20T14:35:00Z",
      "by": "工程師張"
    }
  ],
  "relations": {
    "wbs": {
      "id": "3.2.1",
      "name": "B2 柱筋綁紮",
      "status": "Delayed"
    },
    "location": {
      "id": "B2-Grid C5",
      "name": "B2 Level Grid C5",
      "coordinates": [22.3193, 114.1694]
    },
    "drawingVersion": {
      "id": "A-201-vB",
      "name": "A-201 Structural Plan vB",
      "revision": "B",
      "date": "2025-09-15"
    }
  },
  "createdAt": "2025-09-20T14:30:00Z",
  "updatedAt": "2025-09-21T08:15:00Z"
}
```

### POST /alerts/{alertId}/actions/escalate

Escalate an alert to the next level and optionally schedule a meeting.

**Parameters:**
- `alertId` (path, required): Alert identifier

**Request Body:**
```json
{
  "reason": "Critical path impact requires immediate attention",
  "scheduleMeetingInHours": 2,
  "notifyExternal": true,
  "meetingType": "coordination",
  "participants": ["consultant@example.com", "owner@example.com"]
}
```

**Example Request:**
```http
POST /alerts/RFI-214/actions/escalate
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Critical path impact",
  "scheduleMeetingInHours": 2,
  "notifyExternal": true
}
```

**Example Response:**
```json
{
  "success": true,
  "alertId": "RFI-214",
  "escalationLevel": 2,
  "meetingScheduled": {
    "meetingId": "meeting-456",
    "scheduledAt": "2025-09-21T12:30:00Z",
    "shareUrl": "https://meet.construction-hub.com/meeting-456?token=abc123"
  },
  "notifications": {
    "internal": ["project-manager@company.com"],
    "external": ["consultant@example.com", "owner@example.com"]
  },
  "timestamp": "2025-09-21T10:30:00Z"
}
```

### POST /alerts/{alertId}/actions/remind

Send a reminder notification for an alert.

**Parameters:**
- `alertId` (path, required): Alert identifier

**Request Body:**
```json
{
  "message": "Please provide response to RFI-214 as it affects critical path",
  "includeExternal": false,
  "priority": "high",
  "channels": ["email", "sms"]
}
```

**Example Request:**
```http
POST /alerts/RFI-214/actions/remind
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "Urgent: RFI response required",
  "includeExternal": false
}
```

**Example Response:**
```json
{
  "success": true,
  "alertId": "RFI-214",
  "reminderSent": {
    "to": ["顧問A"],
    "channels": ["email"],
    "messageId": "msg-789"
  },
  "timestamp": "2025-09-21T10:30:00Z"
}
```

### POST /alerts/{alertId}/actions/dispatch

Dispatch personnel or resources to address an alert.

**Parameters:**
- `alertId` (path, required): Alert identifier

**Request Body:**
```json
{
  "vendorId": "vendor-123",
  "etaStart": "2025-09-21T14:00:00Z",
  "etaEnd": "2025-09-21T16:00:00Z",
  "requireGeoCheckin": true,
  "instructions": "Inspect column reinforcement conflict and provide solution",
  "requiredSkills": ["structural-engineering", "rebar-specialist"]
}
```

**Example Request:**
```http
POST /alerts/RFI-214/actions/dispatch
Authorization: Bearer <token>
Content-Type: application/json

{
  "vendorId": "vendor-123",
  "etaStart": "2025-09-21T14:00:00Z",
  "etaEnd": "2025-09-21T16:00:00Z",
  "requireGeoCheckin": true
}
```

**Example Response:**
```json
{
  "success": true,
  "alertId": "RFI-214",
  "dispatchCreated": {
    "dispatchId": "dispatch-101",
    "vendorId": "vendor-123",
    "assignedTo": ["engineer-456"],
    "etaStart": "2025-09-21T14:00:00Z",
    "etaEnd": "2025-09-21T16:00:00Z",
    "trackingUrl": "https://track.construction-hub.com/dispatch-101"
  },
  "notifications": {
    "vendor": ["vendor-123@company.com"],
    "assigned": ["engineer-456@company.com"]
  },
  "timestamp": "2025-09-21T10:30:00Z"
}
```

### POST /alerts/{alertId}/actions/convert-change

Convert an RFI to a change order draft.

**Parameters:**
- `alertId` (path, required): Alert identifier

**Request Body:**
```json
{
  "changeType": "variation",
  "estimatedCost": 50000,
  "estimatedDays": 3,
  "description": "Additional reinforcement work required due to conflict",
  "evidenceIds": ["evidence-1", "evidence-2"],
  "impactAnalysis": {
    "schedule": "3 days delay",
    "cost": "$50,000 additional",
    "quality": "No impact",
    "safety": "Improved safety with proper reinforcement"
  }
}
```

**Example Request:**
```http
POST /alerts/RFI-214/actions/convert-change
Authorization: Bearer <token>
Content-Type: application/json

{
  "changeType": "variation",
  "estimatedCost": 50000,
  "estimatedDays": 3,
  "description": "Additional reinforcement work required"
}
```

**Example Response:**
```json
{
  "success": true,
  "alertId": "RFI-214",
  "changeDraft": {
    "changeId": "change-202",
    "changeNumber": "CO-2025-001",
    "status": "draft",
    "estimatedCost": 50000,
    "estimatedDays": 3,
    "approvalWorkflow": "standard",
    "reviewUrl": "https://review.construction-hub.com/change-202"
  },
  "linkedEvidence": ["evidence-1", "evidence-2"],
  "timestamp": "2025-09-21T10:30:00Z"
}
```

### POST /alerts/bulk/actions

Perform bulk actions on multiple alerts.

**Request Body:**
```json
{
  "alertIds": ["RFI-214", "IR-456", "PUNCH-789"],
  "action": "remind",
  "parameters": {
    "message": "Bulk reminder for overdue items",
    "includeExternal": false
  }
}
```

**Example Request:**
```http
POST /alerts/bulk/actions
Authorization: Bearer <token>
Content-Type: application/json

{
  "alertIds": ["RFI-214", "IR-456"],
  "action": "escalate",
  "parameters": {
    "reason": "Bulk escalation for critical items"
  }
}
```

**Example Response:**
```json
{
  "success": true,
  "processed": 2,
  "failed": 0,
  "results": [
    {
      "alertId": "RFI-214",
      "success": true,
      "escalationLevel": 2
    },
    {
      "alertId": "IR-456",
      "success": true,
      "escalationLevel": 1
    }
  ],
  "timestamp": "2025-09-21T10:30:00Z"
}
```

## WebSocket Events

### Alert Updates

Real-time updates are sent via WebSocket when alert status changes:

```json
{
  "type": "ALERT_UPDATED",
  "projectId": "proj-123",
  "alertId": "RFI-214",
  "changes": {
    "slaLevel": {
      "old": "danger",
      "new": "critical"
    },
    "remainingSeconds": {
      "old": 3600,
      "new": -21600
    }
  },
  "timestamp": "2025-09-21T10:30:00Z"
}
```

### SLA Level Changes

```json
{
  "type": "SLA_LEVEL_CHANGED",
  "alertId": "RFI-214",
  "oldLevel": "danger",
  "newLevel": "critical",
  "reason": "overdue",
  "timestamp": "2025-09-21T10:30:00Z"
}
```

### Auto-Escalations

```json
{
  "type": "AUTO_ESCALATION_TRIGGERED",
  "alertId": "RFI-214",
  "escalationLevel": 2,
  "reason": "critical_path_impact",
  "timestamp": "2025-09-21T10:30:00Z"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "scheduleMeetingInHours",
        "message": "Must be between 1 and 24 hours"
      }
    ],
    "timestamp": "2025-09-21T10:30:00Z",
    "requestId": "req-123456"
  }
}
```

### 404 Not Found
```json
{
  "error": {
    "code": "ALERT_NOT_FOUND",
    "message": "Alert with ID 'RFI-214' not found",
    "timestamp": "2025-09-21T10:30:00Z",
    "requestId": "req-123456"
  }
}
```

### 403 Forbidden
```json
{
  "error": {
    "code": "INSUFFICIENT_PERMISSIONS",
    "message": "You do not have permission to escalate this alert",
    "requiredRole": "project_manager",
    "currentRole": "engineer",
    "timestamp": "2025-09-21T10:30:00Z",
    "requestId": "req-123456"
  }
}
```

## Rate Limiting

Alert endpoints have specific rate limits:

- **List alerts**: 100 requests per minute
- **Get alert details**: 200 requests per minute
- **Action endpoints**: 50 requests per minute
- **Bulk actions**: 10 requests per minute

## Examples

### JavaScript/TypeScript

```typescript
import { ConstructionHubAPI } from '@construction-hub/api-client';

const api = new ConstructionHubAPI({
  baseURL: 'https://api.construction-hub.com/v1',
  token: 'your-jwt-token'
});

// Get critical alerts
const alerts = await api.alerts.list('proj-123', {
  types: ['RFI', 'IR'],
  impactMin: 2.0,
  dueWithinHours: 24,
  sort: 'rank'
});

// Escalate an alert
await api.alerts.escalate('RFI-214', {
  reason: 'Critical path impact',
  scheduleMeetingInHours: 2,
  notifyExternal: true
});

// Convert RFI to change
const change = await api.alerts.convertToChange('RFI-214', {
  changeType: 'variation',
  estimatedCost: 50000,
  estimatedDays: 3
});
```

### Python

```python
from construction_hub import ConstructionHubAPI

api = ConstructionHubAPI(
    base_url='https://api.construction-hub.com/v1',
    token='your-jwt-token'
)

# Get critical alerts
alerts = api.alerts.list('proj-123', {
    'types': ['RFI', 'IR'],
    'impactMin': 2.0,
    'dueWithinHours': 24,
    'sort': 'rank'
})

# Escalate an alert
api.alerts.escalate('RFI-214', {
    'reason': 'Critical path impact',
    'scheduleMeetingInHours': 2,
    'notifyExternal': True
})
```

### cURL

```bash
# Get critical alerts
curl -H "Authorization: Bearer <token>" \
     "https://api.construction-hub.com/v1/projects/proj-123/alerts?types=RFI,IR&impactMin=2.0"

# Escalate an alert
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"reason": "Critical path impact", "scheduleMeetingInHours": 2}' \
     "https://api.construction-hub.com/v1/alerts/RFI-214/actions/escalate"
```

