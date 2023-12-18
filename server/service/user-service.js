const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const mailService = require('./mail-service')
const tokenService = require('./token-service')
const UserDTO = require('../dtos/user-dto')
const ApiError = require('../exceptions/api-error')


class UserService {
    async registration(email, password) {
        console.log("service", email, password)
        const candidate = await UserModel.findOne({ email })

        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтой ${email} уже есть`)
        }


        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4(); // v34fa-asfasf-142saf-sa-asf

        const user = await UserModel.create({ email, password: hashPassword, activationLink })
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDTO(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
    async activate(activationLink) {
        const user = await UserModel.findOne({ activationLink })
        if (!user) {
            throw ApiError.BadRequest('Ошибка в ссылке активации')
        }
        user.isActivated = true;
        await user.save()
    }
    async login(email, password) {
        const user = await UserModel.findOne({ email })
        if (!user) {
            throw ApiError.BadRequest('Пользователь не был найден')
        }
        const isPassEuqals = await bcrypt.compare(password, user.password)
        if (!isPassEuqals) {
            throw ApiError.BadRequest('Неправильный пароль')
        }
        const userDto = new UserDTO(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }
    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshsToken(refreshToken)
        const tokenFormDb = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFormDb) {
            throw ApiError.UnauthorizedError()
        }
        const user = await UserModel.findById(userData.id)
        const userDto = new UserDTO(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return { ...tokens, user: userDto }
    }
    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

}

module.exports = new UserService()