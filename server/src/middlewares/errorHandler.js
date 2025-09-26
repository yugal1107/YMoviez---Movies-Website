import { ApiError } from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
    
    let error = err;

    // Check if the error is an instance of ApiError or has a similar structure
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500;
        const message = error.message || "Internal Server Error";
        error = new ApiError(statusCode, message, error.errors || [], error.stack);
    }

    const response = {
        ...error,
        message: error.message,
    };

    // Send the response
    return res.status(error.statusCode).json(response);
};

export { errorHandler };
