import { Request, Response, NextFunction } from 'express';
import { query, validationResult } from 'express-validator';
import { ComputeComplianceBalanceUseCase } from '../../../core/application/ComputeComplianceBalanceUseCase';

export class ComplianceController {
  constructor(
    private computeComplianceBalanceUseCase: ComputeComplianceBalanceUseCase
  ) {}

  /**
   * GET /compliance/cb
   * Get compliance balance for a ship and year
   */
  getComplianceBalance = async (
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

      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string, 10);

      const complianceBalance = await this.computeComplianceBalanceUseCase.execute(
        shipId,
        year
      );

      res.status(200).json({
        success: true,
        data: complianceBalance,
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
   * GET /compliance/adjusted-cb
   * Get adjusted compliance balance after banking for a ship and year
   */
  getAdjustedComplianceBalance = async (
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

      const shipId = req.query.shipId as string;
      const year = parseInt(req.query.year as string, 10);

      const adjustedBalance =
        await this.computeComplianceBalanceUseCase.executeAdjusted(shipId, year);

      res.status(200).json({
        success: true,
        data: adjustedBalance,
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

  // Validation middleware
  static validateComplianceQuery() {
    return [
      query('shipId')
        .notEmpty()
        .withMessage('shipId is required')
        .isString()
        .trim(),
      query('year')
        .notEmpty()
        .withMessage('year is required')
        .isInt({ min: 2000, max: 3000 })
        .withMessage('year must be a valid integer between 2000 and 3000')
        .toInt(),
    ];
  }
}
