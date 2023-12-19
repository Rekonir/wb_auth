const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDTO = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')

// Логика контроллера по пользователям (Сервис пользователя)
class UserService {

    // Регистрация
    async registration(email, password) {

        // Поиск подобного пользователя в БД
        const candidate = await UserModel.findOne({ email })

        // Обработка ошибки, если пользователь с такой почтой уже есть
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже есть`)
        }

        // Хеширование пароля и генерация ссылки для активации
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        // Создание пользователя в БД и оптравка ему по почту письма
        const user = await UserModel.create({ email, password: hashPassword, activationLink })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        // Формирование DTO по юзеру (payload)
        const userDto = new UserDTO(user); // id, email, isActivated

        // Генерация токенов через токен сервис и сохранение его в БД
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    // Активация аккаунта по ссылке в письме на почте
    async activate(activationLink) {

        // Проверка на наличие в БД пользователя с данной ссылкой
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Ошибка в ссылке активации')
        }

        // Фиксация активации (переход по ссылке)
        user.isActivated = true;
        await user.save()
    }

    // Вход
    async login(email, password) {
        // Поиск пользователя по почте в БД и обработка ошибки
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('Пользователь не был найден')
        }
        // Проверка пароля и обработка ошибки
        const isPassEuqals = await bcrypt.compare(password, user.password)
        if (!isPassEuqals) {
            throw ApiError.BadRequest('Неправильный пароль')
        }

        // Формирование DTO по юзеру (payload)
        const userDto = new UserDTO(user); // id, email, isActivated

        // Генерация токенов через токен сервис и сохранение его в БД
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    // Выход
    async logout(refreshToken) {
        // Удаления Refresh токена при помощи сервиса
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    // Обновление токена
    async refresh(refreshToken) {
        // Проверка на ошибку отсутствия Refresh токена
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        // Валидация Refresh токена
        const userData = tokenService.validateRefreshsToken(refreshToken)
        // Проверка наличи Refresh токена в БД при помощи сервиса
        const tokenFormDb = await tokenService.findToken(refreshToken)
        // Обработка ошибки валидации или поиска
        if (!userData || !tokenFormDb) {
            throw ApiError.UnauthorizedError()
        }
        // Поиск пользователя в БД по id
        const user = await UserModel.findById(userData.id)
        // Формирование DTO по юзеру (payload)
        const userDto = new UserDTO(user); // id, email, isActivated
        // Генерация токенов через токен сервис и сохранение его в БД
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }

    // Вывод списка пользователей
    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

}

module.exports = new UserService()