const Router = require('express').Router
const UserController = require('../controllers/user-controller')
const router = new Router()
const { body } = require('express-validator')
const authMiddlewares = require('../middlewares/auth-middlewares')

// Маршрутизация (адрес, контроллер)
// Регистрация с валидацией
router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 3, max: 32 }),
    UserController.registration)

// Вход
router.post('/login', UserController.login)

// Выход
router.post('/logout', UserController.logout)

// Активация почты
router.get('/activate/:link', UserController.activate)

// Обновление Access токена
router.get('/refresh', UserController.refresh)

// Тестовый эндпоинт (получения списка пользователей)
router.get('/users',authMiddlewares, UserController.getUsers)

module.exports = router