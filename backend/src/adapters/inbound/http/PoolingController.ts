import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { CreatePoolUseCase } from '../../../core/application/CreatePoolUseCase';
import { CreatePoolRequest } from '../../../core/domain/entities/Pool';

export class PoolingController {
  constructor(private createPoolUseCase: CreatePoolUseCase) {}

  /**
   * POST /pools
   * Create a compliance pool
   */
  createPool = async (
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

      const { year, members } = req.body;

      const poolRequest: CreatePoolRequest = {
        year,
        members,
      };

      const pool = await this.createPoolUseCase.execute(poolRequest);

      res.status(201).json({
        success: true,
        message: `Successfully created pool for year ${year} with ${members.length} members`,
        data: pool,
      });
    } catch (error) {
      if (error instanceof Error) {
        // Handle validation errors with 400
        if (error.message.includes('validation failed')) {
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
  static validateCreatePool() {
    return [
      body('year')
        .notEmpty()
        .withMessage('year is required')
        .isInt({ min: 2000, max: 3000 })
        .withMessage('year must be a valid integer between 2000 and 3000'),
      body('members')
        .notEmpty()
        .withMessage('members is required')
        .isArray({ min: 2 })
        .withMessage('Pool must have at least 2 members'),
      body('members.*.shipId')
        .notEmpty()
        .withMessage('Each member must have a shipId')
        .isString()
        .trim(),
      body('members.*.cbBefore')
        .notEmpty()
        .withMessage('Each member must have a cbBefore value')
        .isFloat()
        .withMessage('cbBefore must be a number'),
    ];
  }
}
