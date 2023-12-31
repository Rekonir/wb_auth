const nodemailer = require('nodemailer')

// Логика контроллера по почте (Сервис почты)

class MailService {

    // Инициализация почтового клиента фирмы
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }

        })
    }

    // Функция отправки сообщения на почту клиента
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: `${process.env.SMTP_USER}`,
            to: `${to}`,
            subject: `Активация аккаунта на ${process.env.API_URL}`,
            text: "",
            html:
                `
            <div>
                <h1> Для активации аккаунта перейдите по ссылке:</h1>
                <a href="${link}">${link} </a>
            </div>
            `
        })

    }

}

module.exports = new MailService()