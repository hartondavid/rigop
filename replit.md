# RiGoPA: Risk & Governance Platform for Public Administration

## Overview

RiGoPA is a comprehensive modular platform designed to improve contractual risk governance, legal compliance tracking, and process performance across public institutions. The system provides contract lifecycle management with integrated risk assessment, touch point history tracking, compliance monitoring, and audit trail capabilities. Built as a full-stack web application, it serves legal and procurement departments with data-driven insights for better decision-making and risk management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React with TypeScript**: Single-page application using React 18 with TypeScript for type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Component Library**: Shadcn/ui components built on Radix UI primitives for accessibility and consistency
- **Styling**: Tailwind CSS with custom design tokens and government-appropriate color schemes
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas

### Backend Architecture
- **Express.js Server**: Node.js REST API server with TypeScript
- **Database Layer**: Drizzle ORM with PostgreSQL (specifically Neon serverless)
- **File Handling**: Multer middleware for contract document uploads with type validation
- **Session Management**: Express sessions with PostgreSQL store using connect-pg-simple
- **API Design**: RESTful endpoints organized by domain (contracts, compliance, touch-points, audit)

### Database Design
- **Schema-First Approach**: Centralized schema definitions in shared directory using Drizzle
- **Relational Structure**: Core entities include contracts, users, milestones, touch points, compliance rules/checks, risk assessments, and audit logs
- **Enums**: Type-safe status tracking using PostgreSQL enums for contract status, risk levels, compliance status
- **Audit Trail**: Comprehensive logging of all system interactions and changes

### Key Modules Implementation

#### Contract Lifecycle Tracker
- Document upload with file type validation (PDF, DOC, DOCX)
- Contract metadata management with status tracking
- Risk scoring engine with configurable factors
- Milestone tracking and timeline management

#### Touch Point History (TPH) Simulator
- Comprehensive interaction logging (emails, meetings, updates, alerts)
- Time-based workflow tracking between critical states
- Bottleneck detection and delay analysis

#### Compliance Engine
- Rule-based compliance checking against internal/external policies
- Versioned policy library management
- Automated compliance status assessment
- Policy change impact analysis

#### Risk Assessment System
- Multi-factor risk calculation based on contract value, duration, vendor history
- Configurable risk thresholds and scoring weights
- Risk level categorization (low, medium, high, critical)
- Automated risk recommendations

## External Dependencies

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database hosting
- **Database Migrations**: Drizzle Kit for schema migrations and management

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and development experience
- **ESBuild**: Fast JavaScript bundler for production

### File Processing
- **Multer**: Multipart form handling for file uploads
- **File System**: Local file storage for contract documents

### Utility Libraries
- **Zod**: Schema validation for forms and API endpoints
- **Date-fns**: Date manipulation and formatting
- **Class Variance Authority**: Type-safe component variants
- **nanoid**: Unique ID generation

### Development Environment
- **Replit Integration**: Development environment optimizations and plugins
- **WebSocket Support**: Real-time features using native WebSocket with ws library