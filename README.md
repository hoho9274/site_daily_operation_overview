# Site Daily Operation Overview

A comprehensive web application for managing daily operations and site management tasks.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [Development](#development)
- [Testing](#testing)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

This project provides a comprehensive solution for daily operation management with features including:

- **Authentication & Account Management**: Secure user registration, login, and session management
- **Family Management**: Create and manage family groups with role-based permissions
- **Child Profile Management**: Complete child profile and record management
- **Schedule & Events**: Calendar management and event scheduling
- **Class Management**: Class creation, enrollment, and attendance tracking
- **Data Synchronization**: Cross-device sync with offline support

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/louiswhlui/site_daily_operation_overview.git
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

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## 🛠️ Development

### Development Workflow

This project follows a comprehensive Software Development Life Cycle (SDLC) with the following phases:

1. **Planning Phase**
   - Feature PRD creation
   - Technical specification
   - Architecture documents
   - Test plans

2. **Development Phase**
   - Test-Driven Development (TDD)
   - Code documentation
   - API documentation
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

# Bug fixes
fix/[ticket-number]-bug-description

# Releases
release/v1.2.0
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Features
feat: Add new functionality
feat(auth): Implement user authentication

# Bug fixes
fix: Resolve authentication issue
fix(storage): Handle data persistence

# Documentation
docs: Update API documentation

# Testing
test: Add unit tests for auth module
```

## 🧪 Testing

### Test Coverage Requirements

- **Standard Features**: 80% coverage minimum
- **Critical Flows**: 100% coverage required

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
```

### Critical Flows

The following flows require comprehensive testing:

- Authentication & Account Management
- Family Management
- Child Profile Management
- Schedule & Events
- Class Management
- Data Synchronization

See [CRITICAL_FLOWS.md](./docs/sdlc/CRITICAL_FLOWS.md) for detailed testing requirements.

## 📚 Documentation

### Documentation Structure

- `docs/features/` - Feature-specific documentation
- `docs/high-level-design/` - Architecture and design documents
- `docs/PRD/` - Product Requirements Documents
- `docs/sdlc/` - Software Development Life Cycle guidelines

### Documentation Guidelines

- Follow the templates in [DOCUMENTATION_GUIDELINES.md](./docs/sdlc/DOCUMENTATION_GUIDELINES.md)
- Maintain comprehensive API documentation
- Update documentation with each feature
- Review documentation as part of the PR process

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
site_daily_operation_overview/
├── docs/                    # Documentation
│   ├── features/           # Feature documentation
│   ├── high-level-design/  # Architecture docs
│   ├── PRD/               # Product requirements
│   └── sdlc/              # SDLC guidelines
├── src/                   # Source code
├── tests/                 # Test files
├── e2e/                   # End-to-end tests
├── .github/               # GitHub templates and workflows
└── README.md             # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENVIRONMENT=development

# Authentication
REACT_APP_AUTH_DOMAIN=your-auth-domain
REACT_APP_AUTH_CLIENT_ID=your-client-id

# Database
DATABASE_URL=your-database-url

# External Services
REACT_APP_ANALYTICS_ID=your-analytics-id
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance metrics acceptable
- [ ] Documentation updated
- [ ] Environment variables configured

## 📞 Support

For support and questions:

- Create an issue in the GitHub repository
- Check the documentation in the `docs/` directory
- Review the SDLC guidelines for development processes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Development team for comprehensive SDLC implementation
- Contributors for maintaining high code quality standards
- Community for feedback and suggestions

---

**Note**: This project follows a comprehensive Software Development Life Cycle (SDLC) with strict testing requirements, documentation standards, and quality assurance processes. Please review the SDLC documentation in `docs/sdlc/` before contributing.
