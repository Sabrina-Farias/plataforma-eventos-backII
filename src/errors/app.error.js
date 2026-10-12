export class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Recurso no encontrado") {
        super(message, 404);
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "No autenticado") {
        super(message, 401);
    }
}

export class ForbiddenError extends AppError {
    constructor(message = "No tenés permisos para realizar esta acción") {
        super(message, 403);
    }
}

export class ConflictError extends AppError {
    constructor(message = "El recurso ya existe o entra en conflicto") {
        super(message, 409);
    }
}
