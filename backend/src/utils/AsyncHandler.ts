import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    statusCode?: number;
    isJoi?: boolean;
}

type AsyncFunction = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void>;

const asyncHandler = (fn: AsyncFunction) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await fn(req, res, next);
        } catch (error: unknown) {
            const customError = error as CustomError;
            
            if (customError.isJoi === true) {
                customError.statusCode = 422;
            }

            const statusCode = customError.statusCode || 500;
            const message = customError.message || 'Internal Server Error';

            res.status(statusCode).json({
                success: false,
                statusCode,
                message
            });
        }
    };
};

export { asyncHandler };