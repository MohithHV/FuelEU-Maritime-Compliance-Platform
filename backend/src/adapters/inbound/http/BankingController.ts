import { Request, Response, NextFunction } from 'express';
import { query, body, validationResult } from 'express-validator';
import { BankSurplusUseCase } from '../../../core/application/BankSurplusUseCase';
import { ApplyBankedSurplusUseCase } from '../../../core/application/ApplyBankedSurplusUseCase';
import { IBankingRepository } from '../../../core/ports/IBankingRepository';

export class BankingController {
  constructor(
    private bankSurplusUseCase: BankSurplusUseCase,
    private applyBankedSurplusUseCase: ApplyBankedSurplusUseCase,
    private bankingRepository: IBankingRepository
  ) {}

  /**
   * GET /banking/records
   * Get bank records for a ship and year
   */
  getBankRecords = async (
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

      const bankRecords = await this.bankingRepository.findByShipAndYear(
        shipId,
        year
      );

      res.status(200).json({
        success: true,
        data: bankRecords,
        count: bankRecords.length,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /banking/bank
   * Bank positive compliance balance
   */
  bankSurplus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { shipId, year, amount } = req.body;

      const bankEntry = await this.bankSurplusUseCase.execute(
        shipId,
        year,
        amount
      );

      res.status(201).json({
        success: true,
        message: `Successfully banked ${amount} gCO2eq for ship ${shipId} in year ${year}`,
        data: bankEntry,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Handle business logic errors with 400
        if (
          error.message.includes('must be positive') ||
          error.message.includes('no surplus') ||
          error.message.includes('exceeds available')
        ) {
          res.status(400).json({
            success: false,
            error: error.message,
          });
          return;
        }
        // Handle not found errors
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  /**
   * POST /banking/apply
   * Apply banked surplus to a specific year
   */
  applyBankedSurplus = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validate request body
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { shipId, year, amount } = req.body;

      const complianceBalance = await this.applyBankedSurplusUseCase.execute(
        shipId,
        year,
        amount
      );

      res.status(200).json({
        success: true,
        message: `Successfully applied ${amount} gCO2eq from banked surplus for ship ${shipId} in year ${year}`,
        data: complianceBalance,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Handle business logic errors with 400
        if (
          error.message.includes('must be positive') ||
          error.message.includes('Insufficient banked balance')
        ) {
          res.status(400).json({
            success: false,
            error: error.message,
          });
          return;
        }
        // Handle not found errors
        if (error.message.includes('not found')) {
          res.status(404).json({
            success: false,
            error: error.message,
          });
          return;
        }
      }
      next(error);
    }
  };

  // Validation middleware
  static validateGetBankRecords() {
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

  static validateBankSurplus() {
    return [
      body('shipId')
        .notEmpty()
        .withMessage('shipId is required')
        .isString()
        .trim(),
      body('year')
        .notEmpty()
        .withMessage('year is required')
        .isInt({ min: 2000, max: 3000 })
        .withMessage('year must be a valid integer between 2000 and 3000'),
      body('amount')
        .notEmpty()
        .withMessage('amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('amount must be a positive number'),
    ];
  }

  static validateApplyBankedSurplus() {
    return [
      body('shipId')
        .notEmpty()
        .withMessage('shipId is required')
        .isString()
        .trim(),
      body('year')
        .notEmpty()
        .withMessage('year is required')
        .isInt({ min: 2000, max: 3000 })
        .withMessage('year must be a valid integer between 2000 and 3000'),
      body('amount')
        .notEmpty()
        .withMessage('amount is required')
        .isFloat({ min: 0.01 })
        .withMessage('amount must be a positive number'),
    ];
  }
}
