export const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Error interno del servidor";

    if (err.name === "CastError") {
        statusCode = 400;
        message = `ID inválido para el campo: ${err.path}`;
    }

    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    return res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};
