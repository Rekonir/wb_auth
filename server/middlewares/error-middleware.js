const ApiError = require('../exceptions/api-error')

// Middleware по обработке ошибок
module.exports = function (err, req, res, next) {
    console.log(err);
    if (err instanceof ApiError) {
        // Ответ на клиент по ApiError
        return res.status(err.status).json({ message: err.message, errors: err.errors })
    }
    // Ошибка вне ApiError
    return res.status(500).json({ message: 'Непредвиденная ошибка' })

}