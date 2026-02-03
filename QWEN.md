# @purecore/apify - One API 4 All

## Project Overview

`@purecore/apify` is a modern, feature-rich Node.js framework that provides an Express-compatible API with advanced capabilities including:

- **Auto-generation of CRUD APIs** from Zod schemas
- **Advanced decorators** for resilience, observability, security, and performance
- **AON (Adaptive Observability Negotiation)** with CrystalBox Mode
- **Built-in security features** including Helmet.js integration
- **TypeScript-first** approach with full type safety

The project is designed to accelerate API development by automatically generating complete CRUD operations from simple Zod schemas, while providing enterprise-grade features like circuit breakers, timeouts, caching, authentication, and observability.

## Architecture & Key Features

### 1. Auto-Code Generation System
- Automatically generates complete CRUD modules from Zod schemas
- Creates: repository, service, controller, routes, DTOs, interfaces, and tests
- Generates database schemas and indexes automatically
- Supports nested objects and complex validation rules

### 2. Advanced Decorators System
- **Resilience**: CircuitBreaker, Timeout, Failover
- **Observability**: Logs, Metrics, TraceSpan
- **Security**: AuthJWTGuard, XSSGuard, CSRFGuard, HelmetGuard
- **Performance**: SmartCache, CQRS, Memoization
- **Presets**: ApifyCompleteSentinel (all-in-one decorator)

### 3. AON (Adaptive Observability Negotiation)
- **Black Box Mode**: Traditional JSON response
- **Glass Box Mode**: Streaming telemetry in real-time (NDJSON)
- **CrystalBox Mode**: Interactive observability with self-healing
- Self-healing capabilities with developer notifications
- Early Hints (103 status code) for preload optimization

### 4. Security Features
- Full Helmet.js implementation (CSP, HSTS, X-Frame-Options, etc.)
- JWT Authentication with configurable NO_AUTH routes
- XSS protection and CSRF guards
- Input validation with Zod schemas

## Building and Running

### Prerequisites
- Node.js >= 20.0.0
- Bun (recommended) or npm/yarn/pnpm

### Installation
```bash
npm install @purecore/apify
# or
bun add @purecore/apify
```

### Development Commands
```bash
# Run in development mode
npm run dev
# or
bun run src/index.ts

# Build for production
npm run build

# Start production build
npm start

# Generate code from Zod schemas
npm run generate:schemas

# Run tests
npm test

# Run benchmarks
npm run benchmark

# Run AON examples
npm run demo:aon
npm run demo:crystalbox
```

### Environment Configuration
Create a `.env` file with the following variables:

```bash
# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# NO_AUTH routes (routes without authentication)
NO_AUTH="GET /health, POST /login, GET /status"

# Circuit Breaker settings
CIRCUIT_BREAKER_FAILURE_THRESHOLD=5
CIRCUIT_BREAKER_RESET_TIMEOUT=10000

# Timeout settings
TIMEOUT_DEFAULT_MS=30000
TIMEOUT_MAX_MS=60000
TIMEOUT_RETRY_ATTEMPTS=3

# Cache settings
CACHE_DEFAULT_TTL=300

# AON Configuration
AON_ENABLED=true
AON_DEBUG=true
AON_HEALING_TIMEOUT=10000

# CrystalBox Configuration
CRYSTALBOX_INTERACTIVE=true
DEV_WHATSAPP=+5511999999999
DEV_SLACK=#dev-alerts
WHATSAPP_TOKEN=your_token
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
```

## Usage Examples

### Basic Usage (Express-compatible)
```typescript
import { Apify, jsonBodyParser } from '@purecore/apify';

const app = new Apify();

// Middleware global (body parser, logger, etc.)
app.use(jsonBodyParser);

// Rota com params e query
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  const { role } = req.query;
  res.status(200).json({ id, role, message: 'Usuário encontrado' });
});

// Sub-router (igual express.Router)
const apiRouter = new Apify();
apiRouter.get('/status', (req, res) => res.json({ status: 'ok' }));
app.use('/api', apiRouter);

app.listen(3344, () => console.log('@purecore/apify rodando na porta 3344'));
```

### Auto-Generation from Zod Schema
Create a schema file in `src/modules/`:

```typescript
// src/modules/patient.ts
import { z } from 'zod';

export const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(15),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  address: z.object({
    street: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }).optional(),
});
```

The system automatically generates:
- Repository with CRUD operations
- Service with business logic
- Controller with HTTP handlers
- Routes with Express routing
- DTOs and TypeScript interfaces
- Automated tests
- Database schemas

### Using ApifyCompleteSentinel (All-in-One Decorator)
```typescript
import { ApifyCompleteSentinel } from '@purecore/apify';

class UsersController {
  @ApifyCompleteSentinel
  async list(req, res) {
    // Includes: Circuit Breaker, Timeout, WS Retry Channel
    // Logger, Metrics, TraceSpan, JWT Auth, XSS Protection
    // Smart Cache (5min TTL), Helmet Security
    res.json({ ok: true });
  }
}
```

### AON (Adaptive Observability Negotiation)
```typescript
import { withCrystalBox, requestInteractiveHealing, sendEarlyHints } from '@purecore/apify';

app.get('/api/users/:id', withCrystalBox(async (req, res) => {
  // Send Early Hints (103) for preload
  sendEarlyHints(req, {
    theme: req.userTheme,
    preloadLinks: ['/css/user-profile.css'],
    offlineComponents: ['user-cache']
  });

  // Interactive healing if needed
  if (connectionFailed) {
    const healed = await requestInteractiveHealing(
      req,
      'database_recovery',
      'Conexão com banco perdida',
      { database: 'users_db', errorCode: 'ECONNREFUSED' }
    );

    if (!healed) {
      return res.status(503).json({ error: 'Healing em andamento...' });
    }
  }

  return { user: userData };
}));
```

## Development Conventions

### Project Structure
```
src/
├── index.ts              # Main entry point with Apify class
├── router.ts             # Router implementation
├── types.ts              # Type definitions
├── auto-generator.ts     # Auto-generation system
├── zod-analyzer.ts       # Zod schema analyzer
├── decorators/           # All decorators implementation
│   ├── config.ts         # Decorator presets (ApifyCompleteSentinel)
│   ├── resilience.ts     # Circuit breaker, timeout, etc.
│   ├── observability.ts  # Logging, metrics, tracing
│   ├── security.ts       # Authentication, authorization
│   └── performance.ts    # Caching, CQRS
├── aon/                  # Adaptive Observability Negotiation
│   ├── middleware.ts     # AON middleware
│   ├── crystal-middleware.ts # CrystalBox implementation
│   └── types.ts          # AON types
├── middlewares/          # Standard middlewares
├── errors/               # Error classes
├── healer/               # Self-healing system
└── modules/              # Generated modules (auto-created)
```

### Testing
- Unit tests for individual components
- Integration tests for API endpoints
- Performance tests for critical paths
- AON/CrystalBox mode tests

### Code Generation
- Follow Zod schema conventions for auto-generation
- Use consistent naming patterns
- Leverage the auto-generation system for CRUD operations
- Customize generated code as needed

## Key Technologies

- **TypeScript**: Strong typing throughout
- **Zod**: Schema validation and code generation
- **Node.js**: Runtime environment
- **Express-compatible**: Familiar API for developers
- **WebSocket**: For interactive healing and notifications
- **Prisma**: Database ORM (optional)

## Special Features

### CLI Generator
```bash
npx @purecore/apify create crud users
```

This command generates a complete CRUD module with all necessary files and registers it in your main application.

### Everything as Code (EaC)
The framework supports Everything as Code declarations for infrastructure and configuration management.

### Self-Healing System
- Automatic recovery from common failures
- Developer notifications via WhatsApp/Slack/Teams
- Interactive healing with developer intervention
- Early hints for optimized client experience

### Theme Detection & Offline Support
- Automatic theme detection (light/dark)
- Offline-first capabilities
- Preload optimization based on user preferences