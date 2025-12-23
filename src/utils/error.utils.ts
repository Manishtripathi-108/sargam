export class AppError extends Error {
    statusCode: number;
    safeMessage: string;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.safeMessage = message;
    }
}

export const notFound = (message: string) => new AppError(message, 404);

export const assertData = <T>(data: T | null | undefined, message: string, cn?: () => boolean): T => {
    if (data === null || data === undefined || (cn && cn())) {
        throw notFound(message);
    }
    return data;
};

export const wrapError = (err: unknown, message: string, statusCode: number = 500): never => {
    if (err instanceof AppError) throw err;
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    throw new AppError(`${message}: ${errorMessage}`, statusCode);
};
