import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

/**
 * Validation middleware to validate request data using class-validator
 * @param dtoClass DTO class to validate against
 * @param validationType Type of validation ('body' | 'query' | 'params')
 */
export const validationMiddleware = (dtoClass: any, validationType: 'body' | 'query' | 'params' = 'body') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      let dataToValidate: any;

      // Get data from request based on validation type
      switch (validationType) {
        case 'body':
          dataToValidate = req.body;
          break;
        case 'query':
          dataToValidate = req.query;
          break;
        case 'params':
          dataToValidate = req.params;
          break;
        default:
          dataToValidate = req.body;
      }

      // Transform plain object to class instance
      const dto = plainToClass(dtoClass, dataToValidate);

      // Validate DTO
      const errors: ValidationError[] = await validate(dto, {
        whitelist: true, // Only keep properties with decorators
        forbidNonWhitelisted: true, // Reject properties without decorators
      });

      if (errors.length > 0) {
        // Format error messages
        const errorMessages = formatValidationErrors(errors);

        return res.status(400).json({
          code: 400,
          message: 'Validation failed',
          errors: errorMessages,
          timestamp: new Date().toISOString(),
        });
      }

      // Assign validated data back to request
      switch (validationType) {
        case 'body':
          (req as any).processedBody = dto;
          break;
        case 'query':
          (req as any).processedQuery = dto;
          break;
        case 'params':
          (req as any).processedParams = dto;
          break;
      }

      next();
    } catch (error) {
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        code: 500,
        message: 'Internal server error during validation',
        timestamp: new Date().toISOString(),
      });
    }
  };
};

/**
 * Format validation errors into array of strings
 * @param errors Array of ValidationError
 * @returns Array of formatted error messages
 */
function formatValidationErrors(errors: ValidationError[]): string[] {
  const errorMessages: string[] = [];

  const extractErrors = (error: ValidationError, parentProperty = '') => {
    const property = parentProperty ? `${parentProperty}.${error.property}` : error.property;

    // If there are constraints (validation rules), add to error messages
    if (error.constraints) {
      Object.values(error.constraints).forEach(constraint => {
        errorMessages.push(`${property}: ${constraint}`);
      });
    }

    // If there are nested errors (for child objects), recurse
    if (error.children && error.children.length > 0) {
      error.children.forEach(childError => {
        extractErrors(childError, property);
      });
    }
  };

  errors.forEach(error => extractErrors(error));

  return errorMessages;
}

/**
 * Middleware to validate path parameters (like :id)
 * @param paramName Parameter name to validate
 * @param validationType Validation type ('number' | 'string' | 'uuid')
 */
export const validateParam = (paramName: string, validationType: 'number' | 'string' | 'uuid' = 'number') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const paramValue = req.params[paramName];

    if (!paramValue) {
      return res.status(400).json({
        code: 400,
        message: `Parameter '${paramName}' is required`,
        timestamp: new Date().toISOString(),
      });
    }

    switch (validationType) {
      case 'number':
        const numValue = parseInt(paramValue);
        if (isNaN(numValue) || numValue <= 0) {
          return res.status(400).json({
            code: 400,
            message: `Parameter '${paramName}' must be a positive number`,
            timestamp: new Date().toISOString(),
          });
        }
        req.params[paramName] = numValue.toString();
        break;

      case 'uuid':
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(paramValue)) {
          return res.status(400).json({
            code: 400,
            message: `Parameter '${paramName}' must be a valid UUID`,
            timestamp: new Date().toISOString(),
          });
        }
        break;

      case 'string':
        if (typeof paramValue !== 'string' || paramValue.trim().length === 0) {
          return res.status(400).json({
            code: 400,
            message: `Parameter '${paramName}' must be a non-empty string`,
            timestamp: new Date().toISOString(),
          });
        }
        break;
    }

    next();
  };
};
