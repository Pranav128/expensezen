---
description: Repository Information Overview
alwaysApply: true
---

# ExpenseZen Information

## Summary
ExpenseZen is a modern, intuitive, and secure web application designed to help users track daily expenses, gain insights into spending habits, and take control of financial health. Built with Next.js, MongoDB, and Tailwind CSS, it provides features like secure authentication, expense logging, AI-powered category suggestions, interactive dashboard, and comprehensive transaction history.

## Structure
- **src/**: Main source code directory
  - **app/**: Next.js app router components and pages
  - **components/**: Reusable UI components
  - **models/**: MongoDB schema definitions
  - **context/**: React context providers
  - **ai/**: AI integration with Google AI & Genkit
  - **hooks/**: Custom React hooks
  - **lib/**: Utility libraries
  - **types/**: TypeScript type definitions
  - **helpers/**: Helper functions
- **public/**: Static assets and uploaded files
- **docs/**: Documentation, screenshots, and database scripts

## Language & Runtime
**Language**: TypeScript/JavaScript
**Version**: ES2017 target
**Framework**: Next.js 15.3.3
**Build System**: Next.js build system
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- Next.js 15.3.3 (React framework)
- React 18.3.1 (UI library)
- MongoDB with Mongoose 8.5.1 (Database)
- JWT & bcryptjs (Authentication)
- Tailwind CSS (Styling)
- Radix UI components (UI components)
- Genkit & Google AI (AI integration)
- Recharts (Data visualization)
- Zod (Schema validation)

**Development Dependencies**:
- TypeScript 5
- Various type definitions (@types/*)
- Tailwind CSS tooling
- Genkit CLI

## Build & Installation
```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

## AI Integration
**Framework**: Google AI & Genkit
**Main Files**: 
- src/ai/flows/suggest-expense-category.ts
- src/ai/genkit.ts
- src/ai/dev.ts
**Run Commands**:
```bash
# Start Genkit development
npm run genkit:dev

# Watch mode for Genkit
npm run genkit:watch
```

## Database
**Type**: MongoDB (with Mongoose ORM)
**Models**:
- User (src/models/user.ts)
- Expense (src/models/expense.ts)
**Connection**: Via environment variable MONGODB_URI

## Configuration
**Environment Variables**:
- MONGODB_URI: MongoDB connection string
- JWT_SECRET: Secret key for JWT authentication

**TypeScript Config**: tsconfig.json with ES2017 target, Next.js plugin
**Next.js Config**: next.config.ts with API routes CORS headers, image optimization