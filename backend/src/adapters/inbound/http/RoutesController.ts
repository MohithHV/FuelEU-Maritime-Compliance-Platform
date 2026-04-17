import { Request, Response, NextFunction } from 'express';
import { query, param, validationResult } from 'express-validator';
import { GetAllRoutesUseCase } from '../../../core/application/GetAllRoutesUseCase';
import { SetBaselineRouteUseCase } from '../../../core/application/SetBaselineRouteUseCase';
import { GetComparisonUseCase } from '../../../core/application/GetComparisonUseCase';
import { RouteFilters } from '../../../core/domain/entities/Route';

export class RoutesController {
  constructor(
    private getAllRoutesUseCase: GetAllRoutesUseCase,
    private setBaselineRouteUseCase: SetBaselineRouteUseCase,
    private getComparisonUseCase: GetComparisonUseCase
  ) {}

  /**
   * GET /routes
   * Get all routes with optional filters
   */
  getAllRoutes = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate query parameters
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const filters: RouteFilters = {};

      if (req.query.vesselType) {
        filters.vesselType = req.query.vesselType as string;
      }
      if (req.query.fuelType) {
        filters.fuelType = req.query.fuelType as string;
      }
      if (req.query.year) {
        filters.year = parseInt(req.query.year as string, 10);
      }

      const routes = await this.getAllRoutesUseCase.execute(filters);

      res.status(200).json({
        success: true,
        data: routes,
        count: routes.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /routes/:routeId/baseline
   * Set a route as baseline
   */
  setBaseline = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate route parameter
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { routeId } = req.params;

      const route = await this.setBaselineRouteUseCase.execute(String(routeId));

      res.status(200).json({
        success: true,
        message: `Route ${routeId} set as baseline`,
        data: route,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }
      next(error);
    }
  };

  /**
   * GET /routes/comparison
   * Get baseline vs comparison data
   */
  getComparison = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const comparisonResult = await this.getComparisonUseCase.execute();

      res.status(200).json({
        success: true,
        data: comparisonResult,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('No baseline')) {
        res.status(404).json({
          success: false,
          error: error.message,
        });
        return;
      }
      next(error);
    }
  };

  // Validation middleware
  static validateGetAllRoutes() {
    return [
      query('vesselType').optional().isString().trim(),
      query('fuelType').optional().isString().trim(),
      query('year').optional().isInt({ min: 2000, max: 3000 }).toInt(),
    ];
  }

  static validateSetBaseline() {
    return [param('routeId').notEmpty().isString().trim()];
  }
}
