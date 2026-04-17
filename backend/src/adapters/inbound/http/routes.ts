import { Router } from 'express';
import { RoutesController } from './RoutesController';
import { ComplianceController } from './ComplianceController';
import { BankingController } from './BankingController';
import { PoolingController } from './PoolingController';

// Import use cases
import { GetAllRoutesUseCase } from '../../../core/application/GetAllRoutesUseCase';
import { SetBaselineRouteUseCase } from '../../../core/application/SetBaselineRouteUseCase';
import { GetComparisonUseCase } from '../../../core/application/GetComparisonUseCase';
import { ComputeComplianceBalanceUseCase } from '../../../core/application/ComputeComplianceBalanceUseCase';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedSurplusUseCase } from '../../../core/application/ApplyBankedSurplusUseCase';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';

// Import repositories (these should be injected from a DI container in production)
import { IRouteRepository } from '../../../core/ports/IRouteRepository';
import { IComplianceRepository } from '../../../core/ports/IComplianceRepository';
import { IBankingRepository } from '../../../core/ports/IBankingRepository';
import { IPoolRepository } from '../../../core/ports/IPoolRepository';

/**
 * Creates and configures the Express router with all API routes
 * @param repositories - Object containing all repository instances
 */
export function createRouter(repositories: {
  routeRepository: IRouteRepository;
  complianceRepository: IComplianceRepository;
  bankingRepository: IBankingRepository;
  poolRepository: IPoolRepository;
}): Router {
  const router = Router();

  // Initialize use cases
  const getAllRoutesUseCase = new GetAllRoutesUseCase(
    repositories.routeRepository
  );
  const setBaselineRouteUseCase = new SetBaselineRouteUseCase(
    repositories.routeRepository
  );
  const getComparisonUseCase = new GetComparisonUseCase(
    repositories.routeRepository
  );
  const computeComplianceBalanceUseCase = new ComputeComplianceBalanceUseCase(
    repositories.complianceRepository,
    repositories.bankingRepository
  );
  const bankSurplusUseCase = new BankSurplusUseCase(
    repositories.bankingRepository,
    repositories.complianceRepository
  );
  const applyBankedSurplusUseCase = new ApplyBankedSurplusUseCase(
    repositories.bankingRepository,
    repositories.complianceRepository
  );
  const createPoolUseCase = new CreatePoolUseCase(
    repositories.poolRepository,
    repositories.complianceRepository
  );

  // Initialize controllers
  const routesController = new RoutesController(
    getAllRoutesUseCase,
    setBaselineRouteUseCase,
    getComparisonUseCase
  );

  const complianceController = new ComplianceController(
    computeComplianceBalanceUseCase
  );

  const bankingController = new BankingController(
    bankSurplusUseCase,
    applyBankedSurplusUseCase,
    repositories.bankingRepository
  );

  const poolingController = new PoolingController(createPoolUseCase);

  // Routes endpoints
  router.get(
    '/routes',
    RoutesController.validateGetAllRoutes(),
    routesController.getAllRoutes
  );

  router.post(
    '/routes/:routeId/baseline',
    RoutesController.validateSetBaseline(),
    routesController.setBaseline
  );

  router.get('/routes/comparison', routesController.getComparison);

  // Compliance endpoints
  router.get(
    '/compliance/cb',
    ComplianceController.validateComplianceQuery(),
    complianceController.getComplianceBalance
  );

  router.get(
    '/compliance/adjusted-cb',
    ComplianceController.validateComplianceQuery(),
    complianceController.getAdjustedComplianceBalance
  );

  // Banking endpoints
  router.get(
    '/banking/records',
    BankingController.validateGetBankRecords(),
    bankingController.getBankRecords
  );

  router.post(
    '/banking/bank',
    BankingController.validateBankSurplus(),
    bankingController.bankSurplus
  );

  router.post(
    '/banking/apply',
    BankingController.validateApplyBankedSurplus(),
    bankingController.applyBankedSurplus
  );

  // Pooling endpoints
  router.post(
    '/pools',
    PoolingController.validateCreatePool(),
    poolingController.createPool
  );

  return router;
}
