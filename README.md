# Construction Daily Operations Hub

A comprehensive construction project management platform that provides real-time visibility into daily operations, critical path monitoring, and integrated workflow automation for construction projects.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**Construction Daily Operations Hub** is a mobile-first, event-driven construction management platform designed to address the critical pain points in construction project execution:

- **Version Control Issues**: Inconsistent drawings, models, and forms leading to construction errors
- **High Follow-up Costs**: Invisible SLA countdowns and unregulated escalation processes
- **Slow Data Backflow**: Offline difficulties and unstructured data causing reporting delays
- **Disconnected Cost/Schedule**: Progress events not automatically reflected in cost/value and cash flow models
- **Insufficient Evidence Chain**: Lack of audit trails to support claims and compliance

### 🎯 North Star Metrics
- **SLA On-Time Rate** (RFI/IR/rectification/changes) ≥ 90%
- **Critical Path Slippage** ≤ 0 days (weekly observation window)
- **Change Approval Median Time** ↓ 30%
- **Punch Close-out Cycle** ↓ 20%
- **Weekly/Daily Report Auto-Generation Coverage** ≥ 70%

## 🚀 Key Features

### 📊 Dashboard Cards
1. **Critical Alerts** - Real-time risk and SLA countdown management
2. **Schedule Health** - Critical path monitoring and delay attribution
3. **Field Kanban** - Integrated task management for construction teams
4. **Design Coordination** - RFI management and drawing version control
5. **Logistics & Inspection** - Material delivery and quality control tracking
6. **Quality & EHS Actions** - Punch list and safety compliance management
7. **Meetings & Minutes** - Automated meeting management and decision tracking
8. **Cost Snapshot** - Real-time cost and cash flow monitoring
9. **External Communications** - Stakeholder communication management
10. **Daily Briefing** - Pre-meeting preparation and post-meeting task distribution

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Docker (for local development)
- PostgreSQL (for database)
- Redis (for caching and session management)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/hoho9274/site_daily_operation_overview.git
cd site_daily_operation_overview
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development environment:
```bash
# Start database and Redis
docker-compose up -d

# Run database migrations
npm run db:migrate

# Start the development server
npm run dev
# or
yarn dev
```

### Quick Start Guide

1. **Access the Application**: Navigate to `http://localhost:3000`
2. **Create a Project**: Set up your first construction project
3. **Configure WBS**: Define your Work Breakdown Structure
4. **Set up Team**: Add team members and assign roles
5. **Import Schedule**: Upload your project schedule (Primavera P6, MS Project, or Excel)
6. **Start Daily Operations**: Begin using the dashboard cards for daily management

## 🛠️ Development

### Architecture Overview

The platform is built using a **microservices architecture** with **Domain-Driven Design (DDD)** principles:

- **Frontend**: React with TypeScript, mobile-first responsive design
- **Backend**: Node.js microservices with event-driven architecture
- **Database**: PostgreSQL with read replicas for performance
- **Message Queue**: Apache Kafka for event streaming
- **Cache**: Redis for session management and caching
- **File Storage**: AWS S3 for document and media storage
- **Real-time**: WebSocket connections for live updates

### Development Workflow

This project follows a comprehensive Software Development Life Cycle (SDLC) with the following phases:

1. **Planning Phase**
   - Feature PRD creation (see `docs/PRD/`)
   - Technical specification (see `docs/high-level-design/`)
   - Architecture documents
   - Test plans

2. **Development Phase**
   - Test-Driven Development (TDD)
   - Code documentation with JSDoc
   - API documentation (OpenAPI 3.0)
   - Implementation notes

3. **Review Phase**
   - Code review process
   - Documentation review
   - Cross-reference verification

4. **Deployment Phase**
   - Release notes
   - User documentation
   - Migration guides

### Branch Management

```bash
# Feature branches
feature/[ticket-number]-feature-name
# Example: feature/CONST-123-critical-alerts-implementation

# Bug fixes
fix/[ticket-number]-bug-description
# Example: fix/CONST-124-schedule-sync-issue

# Releases
release/v1.2.0
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
feat: Add critical alerts dashboard card
feat(schedule): Implement schedule health monitoring

# Bug fixes
fix: Resolve critical alerts sorting issue
fix(rfi): Handle offline RFI submission

# Documentation
docs: Update API documentation for critical alerts
docs(readme): Add deployment instructions

# Testing
test: Add unit tests for schedule health module
test(e2e): Add critical flows testing for alerts
```

## 🧪 Testing

### Test Coverage Requirements

- **Standard Features**: 80% coverage minimum
- **Critical Flows**: 100% coverage required
- **Business Logic**: 100% coverage for cost calculations and schedule logic

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run e2e:test:ios
npm run e2e:test:android

# Run integration tests
npm run test:integration

# Run performance tests
npm run test:performance
```

### Critical Flows

The following flows require comprehensive testing and are considered critical for construction operations:

- **Critical Alerts Management** - SLA tracking and escalation
- **Schedule Health Monitoring** - Critical path calculations and delay attribution
- **RFI/Change Management** - Information requests and change order processing
- **Quality & Safety Compliance** - Punch list management and EHS tracking
- **Material & Logistics** - Delivery tracking and inspection workflows
- **Cost & Value Management** - Real-time cost monitoring and cash flow
- **Meeting & Decision Management** - Automated meeting workflows and task distribution
- **Daily Briefing Automation** - Pre-meeting preparation and post-meeting task creation

See [CRITICAL_FLOWS.md](./docs/sdlc/CRITICAL_FLOWS.md) for detailed testing requirements.

## 📚 Documentation

### Documentation Structure

- `docs/PRD/` - Product Requirements Documents (Part 1: Summary)
- `docs/high-level-design/` - High-level design specifications (Part 2: Architecture)
- `docs/features/` - Detailed feature specifications (Part 3a-3z: Individual card specs)
- `docs/sdlc/` - Software Development Life Cycle guidelines

### Key Documents

- **[PRD Summary](./docs/PRD/Construction_PRD_Part1_Summary.md)** - Project overview, market fit, and business requirements
- **[High-Level Design](./docs/high-level-design/Construction_PRD_Part2_HighLevel.md)** - Architecture, information structure, and user journeys
- **[Feature Specifications](./docs/features/)** - Detailed specifications for each dashboard card
- **[SDLC Guidelines](./docs/sdlc/)** - Development best practices, testing, and documentation standards

### Documentation Guidelines

- Follow the templates in [DOCUMENTATION_GUIDELINES.md](./docs/sdlc/DOCUMENTATION_GUIDELINES.md)
- Maintain comprehensive API documentation (OpenAPI 3.0)
- Update documentation with each feature
- Review documentation as part of the PR process
- Use Mermaid diagrams for user journeys and system flows

## 🤝 Contributing

### Development Best Practices

1. **Test-Driven Development**
   - Write failing tests first
   - Implement minimum code to pass tests
   - Refactor while keeping tests green

2. **Code Quality**
   - Follow TypeScript/React best practices
   - Maintain proper error handling
   - Use consistent naming conventions

3. **Pull Request Process**
   - Create feature branch from main
   - Include comprehensive tests
   - Update documentation
   - Follow PR template

### Pull Request Template

When creating a pull request, please include:

- Description of changes
- Test coverage report
- Screenshots (if UI changes)
- Documentation updates
- Related issues

## 📋 Project Structure

```
construction-daily-ops-hub/
├── docs/                           # Documentation
│   ├── PRD/                       # Product Requirements Documents
│   │   └── Construction_PRD_Part1_Summary.md
│   ├── high-level-design/         # Architecture and design specs
│   │   └── Construction_PRD_Part2_HighLevel.md
│   ├── features/                  # Detailed feature specifications
│   │   ├── Construction_Part3a_Critical_Alerts.md
│   │   ├── Construction_Part3b_Schedule_Health.md
│   │   ├── Construction_Part3j_Daily_Briefing.md
│   │   └── ... (other feature specs)
│   └── sdlc/                      # SDLC guidelines
│       ├── DEVELOPMENT_BEST_PRACTICES.md
│       ├── TESTING.md
│       ├── DOCUMENTATION_GUIDELINES.md
│       └── CRITICAL_FLOWS.md
├── src/                           # Source code
│   ├── components/                # React components
│   ├── services/                  # API services
│   ├── utils/                     # Utility functions
│   ├── types/                     # TypeScript definitions
│   └── hooks/                     # Custom React hooks
├── tests/                         # Test files
├── e2e/                          # End-to-end tests
├── .github/                      # GitHub templates and workflows
└── README.md                     # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_API_VERSION=v1
REACT_APP_ENVIRONMENT=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/construction_hub
REDIS_URL=redis://localhost:6379

# Authentication
REACT_APP_AUTH_DOMAIN=your-auth-domain
REACT_APP_AUTH_CLIENT_ID=your-client-id

# File Storage
REACT_APP_S3_BUCKET=your-s3-bucket
REACT_APP_S3_REGION=your-region

# External Services
REACT_APP_WEATHER_API_KEY=your-weather-api-key
REACT_APP_BIM_ENGINE_URL=your-bim-engine-url

# Feature Flags
REACT_APP_ENABLE_OFFLINE_MODE=true
REACT_APP_ENABLE_REAL_TIME_UPDATES=true
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Checklist

- [ ] All tests passing (unit, integration, E2E)
- [ ] No console errors or warnings
- [ ] Performance metrics within acceptable ranges
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Redis cache cleared
- [ ] CDN assets uploaded

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `docs/` directory
- Review the SDLC guidelines for development processes
- Contact the development team for critical issues

## 🎯 Roadmap

### Phase 1 (8 weeks) - Foundation
- [ ] Dashboard foundation and card framework
- [ ] Critical Alerts card implementation
- [ ] Schedule Health monitoring
- [ ] Field Kanban basic functionality
- [ ] Daily briefing automation

### Phase 2 (6 weeks) - Core Features
- [ ] Material & Logistics tracking
- [ ] Quality & EHS actions management
- [ ] Meeting & Minutes automation
- [ ] Playbook automation engine

### Phase 3 (6 weeks) - Advanced Features
- [ ] Cost & Value management
- [ ] External communications
- [ ] Advanced reporting and analytics
- [ ] Mobile app optimization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Construction industry experts for domain knowledge
- Development team for comprehensive SDLC implementation
- Contributors for maintaining high code quality standards
- Community for feedback and suggestions

---

**Note**: This project follows a comprehensive Software Development Life Cycle (SDLC) with strict testing requirements, documentation standards, and quality assurance processes. Please review the SDLC documentation in `docs/sdlc/` before contributing.
