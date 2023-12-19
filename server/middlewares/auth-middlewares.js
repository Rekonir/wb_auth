const ApiError = require('../exceptions/api-error');
const tokenService = require('../service/token-service');

// Middleware по обработке ошибок Авторизации
module.exports = function (req, res, next) {
    try {
        // Отсутвие header-а
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }
        // Отсутвие Access токена
        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        // Неверный Access токен
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
};
