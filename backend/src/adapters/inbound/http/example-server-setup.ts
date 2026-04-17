/**
 * Example Server Setup
 *
 * This file demonstrates how to integrate the HTTP controllers
 * into an Express application with proper dependency injection.
 *
 * Copy this to your infrastructure/server directory and customize as needed.
 */

import express, { Express } from 'express';
import cors from 'cors';
import { createRouter, errorHandler, notFoundHandler } from './index';

// Import Prisma repositories
import { PrismaClient } from '@prisma/client';
import { PrismaRouteRepository } from '../../outbound/postgres/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../../outbound/postgres/PrismaComplianceRepository';
import { PrismaBankingRepository } from '../../outbound/postgres/PrismaBankingRepository';
import { PrismaPoolRepository } from '../../outbound/postgres/PrismaPoolRepository';

/**
 * Creates and configures the Express application
 */
export function createApp(): Express {
  const app = express();

  // Initialize Prisma client
  const prisma = new PrismaClient();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logging (simple version)
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // Initialize repositories with Prisma client
  const repositories = {
    routeRepository: new PrismaRouteRepository(prisma),
    complianceRepository: new PrismaComplianceRepository(prisma),
    bankingRepository: new PrismaBankingRepository(prisma),
    poolRepository: new PrismaPoolRepository(prisma),
  };

  // Mount API routes
  const apiRouter = createRouter(repositories);
  app.use('/api', apiRouter);

  // Error handling middleware (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

/**
 * Starts the Express server
 */
export function startServer(port: number = 3000): void {
  const app = createApp();

  app.listen(port, () => {
    console.log(`
========================================
FuelEU Maritime Backend API
========================================
Server running on port ${port}
Environment: ${process.env.NODE_ENV || 'development'}
API Base URL: http://localhost:${port}/api
Health Check: http://localhost:${port}/health
========================================
Available endpoints:
  - GET    /api/routes
  - POST   /api/routes/:routeId/baseline
  - GET    /api/routes/comparison
  - GET    /api/compliance/cb
  - GET    /api/compliance/adjusted-cb
  - GET    /api/banking/records
  - POST   /api/banking/bank
  - POST   /api/banking/apply
  - POST   /api/pools
========================================
    `);
  });
}

// Example usage:
// import { startServer } from './adapters/inbound/http/example-server-setup';
// startServer(3000);
