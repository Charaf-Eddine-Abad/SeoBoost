# Overview

This is a full-stack web application for SEO analysis built with React, Express, and TypeScript. The application allows users to input HTML code and receive detailed SEO analysis results including scoring, recommendations, and actionable insights. It features a modern UI built with shadcn/ui components and Radix UI primitives, providing a comprehensive SEO audit tool for web developers and content creators.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side application is built using React 18 with TypeScript, utilizing a modern component-based architecture:

- **Build System**: Vite for fast development and optimized production builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and API caching
- **UI Framework**: shadcn/ui components built on top of Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

The application follows a modular structure with clear separation between components, pages, hooks, and utilities. The UI uses a consistent design system with support for light/dark themes.

## Backend Architecture

The server-side is built with Express.js and TypeScript, providing a RESTful API architecture:

- **Framework**: Express.js with TypeScript for type safety
- **API Design**: RESTful endpoints with structured JSON responses
- **Request Processing**: Built-in JSON and URL-encoded body parsing
- **Logging**: Custom request/response logging middleware for API monitoring
- **Error Handling**: Centralized error handling with structured error responses
- **HTML Analysis**: Cheerio library for server-side HTML parsing and SEO rule evaluation

The backend implements a comprehensive SEO analysis engine that evaluates HTML code against multiple SEO criteria including title tags, meta descriptions, heading structure, image alt attributes, and content optimization.

## Data Storage Solutions

The application uses a dual storage approach:

- **In-Memory Storage**: MemStorage class for development and testing, providing user management without external dependencies
- **Database Ready**: Drizzle ORM configuration with PostgreSQL support for production environments
- **Session Management**: Connect-pg-simple for PostgreSQL-backed session storage when database is available

The storage interface is abstracted through an IStorage interface, allowing easy switching between storage implementations.

## Development Architecture

- **Monorepo Structure**: Client and server code coexist with shared type definitions
- **Hot Module Replacement**: Vite integration with Express for seamless development experience  
- **Type Safety**: Shared schemas using Zod for runtime validation and TypeScript type generation
- **Path Aliases**: Configured import aliases for clean, maintainable code organization

# External Dependencies

## UI and Component Libraries
- **@radix-ui/***: Comprehensive set of unstyled, accessible UI primitives for building the component system
- **@tanstack/react-query**: Powerful data synchronization library for managing server state, caching, and API interactions
- **shadcn/ui**: Pre-built component library built on Radix UI with consistent styling and accessibility

## Styling and Design
- **tailwindcss**: Utility-first CSS framework for rapid UI development with responsive design capabilities
- **class-variance-authority**: Type-safe utility for creating component variants with Tailwind classes
- **clsx**: Utility for conditionally combining CSS classes

## Form and Validation
- **react-hook-form**: Performant forms library with minimal re-renders and easy validation
- **@hookform/resolvers**: Validation resolvers for React Hook Form
- **zod**: TypeScript-first schema validation library for runtime type checking

## Development and Build Tools
- **vite**: Next-generation frontend build tool with fast HMR and optimized builds
- **typescript**: Static type checking for enhanced developer experience and code reliability
- **@replit/vite-plugin-runtime-error-modal**: Development plugin for better error visualization in Replit environment

## Server-side Processing
- **cheerio**: Server-side jQuery-like HTML manipulation library for SEO analysis
- **express**: Web application framework for Node.js providing robust API capabilities

## Database and Storage
- **drizzle-orm**: TypeScript ORM with excellent developer experience and type safety
- **@neondatabase/serverless**: Serverless PostgreSQL driver for modern database connectivity
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Utilities
- **date-fns**: Modern JavaScript date utility library for date manipulation
- **nanoid**: Secure, URL-friendly unique string ID generator
- **wouter**: Minimalist routing library for React applications