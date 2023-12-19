const { json } = require("express")
const userService = require('../service/user-service')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error')

// Контроллер (присвоение функций к маршруту из router/index.js)
class UserController {
    // Регистрация
    async registration(req, res, next) {
        try {
            // Проверка на ошибку валидации
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }

            // Разворачивание тела запроса
            const { email, password } = req.body;
            // Передача payload-а в сервис регистрации пользователя
            const userData = await userService.registration(email, password);
            // Запись в cookie refresh токена на 30 дней и задание ему httpOnly
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    // Вход
    async login(req, res, next) {
        try {
            // Разворачивание тела запроса
            const { email, password } = req.body
            // Передача payload-а в сервис входа пользователя
            const userData = await userService.login(email, password);
            // Запись в cookie refresh токена на 30 дней и задание ему httpOnly
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        }
        catch (e) {
            next(e)
        }
    }

    // Выход
    async logout(req, res, next) {
        try {
            // Забор из cookies Refresh токена
            const { refreshToken } = req.cookies;
            // Передача токена в сервис выхода пользователя
            const token = await userService.logout(refreshToken);
            // Затирание в cookies Refresh токена
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    // Активация почты
    async activate(req, res, next) {
        try {
            // Формирование ссылки активации по параметру из router
            const activationLink = req.params.link;
            // Вызов сервиса пользователя активации
            await userService.activate(activationLink);
            // Редирект на фортэнд
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e)
        }
    }

    // Обновление Access токена
    async refresh(req, res, next) {
        try {
            // Забор из cookies Refresh токена
            const { refreshToken } = req.cookies;
            // Передача токена в сервис обновления пользователя
            const userData = await userService.refresh(refreshToken);
            // Запись в cookie refresh токена на 30 дней и задание ему httpOnly
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    // Тестовый эндпоинт (получения списка пользователей)
    async getUsers(req, res, next) {
        try {
            // Вызов сервиса выдачи листа пользователей
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

}
module.exports = new UserController
