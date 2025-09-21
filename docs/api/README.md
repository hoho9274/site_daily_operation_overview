# Construction Daily Operations Hub - API Documentation

**Version**: v3.0  
**Date**: 2025-09-21  
**Base URL**: `https://api.construction-hub.com/v1`

## Overview

The Construction Daily Operations Hub API provides comprehensive endpoints for managing construction projects, daily operations, and integrated workflows. The API follows RESTful principles and uses JSON for data exchange.

## Authentication

All API requests require authentication using JWT tokens. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Getting an Access Token

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "role": "project_manager"
  }
}
```

## Rate Limiting

API requests are rate-limited to ensure fair usage:

- **Standard Users**: 1000 requests per hour
- **Premium Users**: 5000 requests per hour
- **Enterprise Users**: 10000 requests per hour

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1640995200
```

## Error Handling

The API uses standard HTTP status codes and returns error details in the response body:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ],
    "timestamp": "2025-09-21T10:30:00Z",
    "requestId": "req-123456"
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid input parameters |
| `UNAUTHORIZED` | 401 | Authentication required |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource conflict |
| `RATE_LIMITED` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Internal server error |

## Data Formats

### Date and Time

All dates and times are in ISO 8601 format with UTC timezone:
```json
{
  "createdAt": "2025-09-21T10:30:00Z",
  "dueDate": "2025-09-25T17:00:00Z"
}
```

### Pagination

List endpoints support pagination using query parameters:

```http
GET /projects?page=1&limit=20&sort=createdAt&order=desc
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### Filtering

Many endpoints support filtering using query parameters:

```http
GET /alerts?status=critical&type=RFI&dueWithinHours=24
```

## WebSocket Events

Real-time updates are provided via WebSocket connections:

```javascript
const ws = new WebSocket('wss://api.construction-hub.com/v1/ws?token=<jwt-token>');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

### Event Types

- `ALERT_UPDATED` - Alert status or details changed
- `SCHEDULE_UPDATED` - Schedule or critical path changed
- `TASK_UPDATED` - Task status or progress changed
- `MEETING_STARTED` - Daily briefing meeting started
- `PERMIT_APPROVED` - Work permit approved

## API Endpoints

### Projects
- [GET /projects](#get-projects) - List projects
- [POST /projects](#post-projects) - Create project
- [GET /projects/{id}](#get-projectsid) - Get project details
- [PUT /projects/{id}](#put-projectsid) - Update project
- [DELETE /projects/{id}](#delete-projectsid) - Delete project

### Critical Alerts
- [GET /projects/{id}/alerts](#get-projectsidalerts) - List critical alerts
- [GET /alerts/{id}](#get-alertsid) - Get alert details
- [POST /alerts/{id}/actions/escalate](#post-alertsidactionsescalate) - Escalate alert
- [POST /alerts/{id}/actions/remind](#post-alertsidactionsremind) - Send reminder

### Schedule Health
- [GET /projects/{id}/schedule/health](#get-projectsidschedulehealth) - Get schedule health
- [POST /schedule/tasks/{id}/what-if](#post-schedule-tasksidwhat-if) - Run what-if simulation
- [POST /schedule/tasks/{id}/attributions](#post-schedule-tasksidattributions) - Add delay attribution

### Daily Briefing
- [GET /projects/{id}/daily-briefing](#get-projectsiddaily-briefing) - Get daily briefing
- [POST /projects/{id}/daily-briefing/prepare](#post-projectsiddaily-briefingprepare) - Prepare briefing
- [POST /daily-briefing/{id}/publish](#post-daily-briefingidpublish) - Publish briefing
- [POST /daily-briefing/{id}/attendance](#post-daily-briefingidattendance) - Record attendance

### Files and Attachments
- [POST /files/upload](#post-filesupload) - Upload file
- [GET /files/{id}](#get-filesid) - Download file
- [DELETE /files/{id}](#delete-filesid) - Delete file

## SDKs and Libraries

### JavaScript/TypeScript
```bash
npm install @construction-hub/api-client
```

```typescript
import { ConstructionHubAPI } from '@construction-hub/api-client';

const api = new ConstructionHubAPI({
  baseURL: 'https://api.construction-hub.com/v1',
  token: 'your-jwt-token'
});

const alerts = await api.alerts.list('project-123');
```

### Python
```bash
pip install construction-hub-api
```

```python
from construction_hub import ConstructionHubAPI

api = ConstructionHubAPI(
    base_url='https://api.construction-hub.com/v1',
    token='your-jwt-token'
)

alerts = api.alerts.list('project-123')
```

### cURL Examples

All endpoints can be accessed using cURL:

```bash
# Get critical alerts
curl -H "Authorization: Bearer <token>" \
     https://api.construction-hub.com/v1/projects/project-123/alerts

# Escalate an alert
curl -X POST \
     -H "Authorization: Bearer <token>" \
     -H "Content-Type: application/json" \
     -d '{"reason": "Critical path impact"}' \
     https://api.construction-hub.com/v1/alerts/alert-456/actions/escalate
```

## Changelog

### v3.0.0 (2025-09-21)
- Initial release of Construction Daily Operations Hub API
- Support for all dashboard cards and workflows
- Real-time WebSocket events
- Comprehensive error handling and validation

---

For more detailed endpoint documentation, see the individual endpoint sections below.

