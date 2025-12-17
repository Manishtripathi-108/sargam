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
