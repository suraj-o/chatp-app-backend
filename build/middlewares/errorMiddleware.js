const errorMiddlewere = (err, req, res, next) => {
    err.message || (err.message = "internal server error");
    err.status || (err.status = 500);
    return res.status(err.status).json({
        succes: false,
        message: err.message
    });
};
const TryCatch = (func) => (req, res, next) => {
    Promise.resolve(func(req, res, next)).catch(next);
};
export { errorMiddlewere, TryCatch };
