import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getPrismaClient } from '../db/prisma';
import { createRouter, errorHandler, notFoundHandler } from '../../adapters/inbound/http';
import { PrismaRouteRepository } from '../../adapters/outbound/postgres/PrismaRouteRepository';
import { PrismaComplianceRepository } from '../../adapters/outbound/postgres/PrismaComplianceRepository';
import { PrismaBankingRepository } from '../../adapters/outbound/postgres/PrismaBankingRepository';
import { PrismaPoolRepository } from '../../adapters/outbound/postgres/PrismaPoolRepository';

// Load environment variables
dotenv.config();

export const createApp = (): Express => {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Initialize Prisma client
  const prisma = getPrismaClient();

  // Initialize repositories
  const repositories = {
    routeRepository: new PrismaRouteRepository(prisma),
    complianceRepository: new PrismaComplianceRepository(prisma),
    bankingRepository: new PrismaBankingRepository(prisma),
    poolRepository: new PrismaPoolRepository(prisma),
  };

  // Mount API routes
  app.use('/api', createRouter(repositories));

  // Error handlers (must be last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
