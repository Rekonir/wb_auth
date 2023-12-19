const jwt = require('jsonwebtoken')
const tokenModel = require('../models/token-model')

// Логика контроллера по токена (Сервис токена)

class TokenSerevice {

    // Функция генерации токенов и настройка времени их жизни
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10m' })
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' })
        return {
            accessToken,
            refreshToken
        }
    }
    // Проверка на время и ликвидность Access токен
    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET)
            return userData
        }
        catch (e) {
            return null
        }
    }
    
    // Проверка на время ликвидность Refresh токен
    validateRefreshsToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
            return userData
        }
        catch (e) {
            return null
        }
    }

    // Сохранение токена
    async saveToken(userId, refreshToken) {
        // Поиск в БД пользовотеля
        const tokenData = await tokenModel.findOne({ user: userId })

        // Перезаписывание у пользователя Refresh токена в БД
        if (tokenData) {
            tokenData.refreshToken = refreshToken
            return tokenData.save()
        }
        // или создание нового прользователя в БД (сущность токенов)
        const token = await tokenModel.create({ user: userId, refreshToken })
        return token
    }

    // Удаление Refresh токена
    async removeToken(refreshToken) {
        // Удаляет из базы Refresh токен
        const tokenData = await tokenModel.deleteOne({ refreshToken })
        return tokenData
    }

    // Поиск Refresh токена
    async findToken(refreshToken) {
        // Поиск Refresh токена в БД
        const tokenData = await tokenModel.findOne({ refreshToken })
        return tokenData
    }
}

module.exports = new TokenSerevice()