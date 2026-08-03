const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    } catch (error) {
        // Zod validation errors
        const formattedErrors = error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message,
        }));
        
        return res.status(400).json({
            success: false,
            message: 'Validation Error',
            errors: formattedErrors,
        });
    }
};

module.exports = {
    validate,
};
