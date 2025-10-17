const uuid = require('uuid')
const ApiError = require('../error/apiError')
const { User, Spending, Category } = require('../models/models')
const path = require('path')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJWT = (id, email, role, name) => { return jwt.sign({ id, email, role, name }, process.env.SECRET, { expiresIn: '24h' }) }

class UserController {
    async registration(req, res, next) {
        try {
            const { email, password, name } = req.body
            if (!email || !password || !name) {
                return next(ApiError.badRequest('В теле запроса должны присутствовать: Email, пароль и имя нового пользователя'))
            }
            const img = req.files?.img
            let filename
            if (img) {
                filename = uuid.v4() + '.jpg'
                await img.mv(path.resolve(__dirname, '..', 'static', filename))
            }
            const userExists = await User.findOne({
                where: {
                    email: email
                }
            })
            if (userExists) {
                return next(ApiError.conflict('Пользователь с таким email уже существует'))
            }
            const hashedPassword = await bcrypt.hash(password, 5)
            const user = await User.create({ email, password: hashedPassword, name, img: filename })
            const token = generateJWT(user.id, user.email, user.role, user.name)
            return res.json({ token })
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return next(ApiError.badRequest('В теле запроса должен присутствовать логин и пароль пользователя'))
            }

            const user = await User.findOne({
                where: {
                    email: email
                }
            })

            if (!user) {
                return next(ApiError.unathorized('Пользователь с таким email не найден!'))
            }
            const comparePassword = bcrypt.compareSync(password, user.password)
            if (!comparePassword) {
                return next(ApiError.unathorized('Неверный пароль!'))
            }
            const token = generateJWT(user.id, user.email, user.role, user.name)

            res.json({ token })


        } catch (e) {
            next(ApiError.internal(e.message))
        }

    }

    async check(req, res, next) {
        const token = generateJWT(req.user.id, req.user.email, req.user.role, req.user.name)
        return res.json({ token })
    }

    async update(req, res, next) {
        try {
            const { email, password, newName, newPassword, newEmail } = req.body
            const newImg = req.files?.newImg
            if (!email || !password) {
                return next(ApiError.badRequest('В теле запроса должен присутствовать логин и пароль пользователя'))
            }
            let filename
            if (newImg) {
                filename = uuid.v4() + '.jpg'
                await newImg.mv(path.resolve(__dirname, '..', 'static', filename))
            }


            const user = await User.findOne({
                where: {
                    email: email,
                    password: password
                }
            })

            if (!user) {
                return next(ApiError.unathorized('Пользователь с такой комбинцией логина и пароля не найден'))
            }

            if (newEmail) {
                const isEmailConflict = await User.findOne({
                    where: {
                        email: newEmail
                    }
                })
                if (isEmailConflict) {
                    return next(ApiError.conflict('Данный email принадлежит другому пользователю'))
                }
            }

            const updateData = {}
            if (newName) { updateData.name = newName }
            if (newPassword) { updateData.password = newPassword }
            if (newEmail) { updateData.email = newEmail }
            if (newImg) { updateData.img = filename }

            if (Object.keys(updateData).length === 0) {
                return next(ApiError.badRequest('В теле запроса отсутствуют данные для обновления пользователя'))
            }
            await user.update(updateData)


            return res.json(user)


        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                return next(ApiError.badRequest('В теле запроса должен присутствовать логин и пароль пользователя'))
            }

            const user = await User.findOne({
                where: {
                    email: email,
                    password: password
                }
            })

            if (!user) {
                return next(ApiError.unathorized('Пользователь с такой комбинцией логина и пароля не найден'))
            }
            await user.destroy()
            res.json({ message: 'Пользователь успешно удален' })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async getStats(req, res, next) {
        try {
            // Получаем всех пользователей с их расходами
            const usersWithSpendings = await User.findAll({
                attributes: ['id', 'name', 'email', 'role', 'img'],
                include: [{
                    model: Spending,
                    attributes: ['id', 'amount', 'purchase_date'],
                    include: [{
                        model: Category,
                        attributes: ['id', 'name', 'color']
                    }]
                }],
                order: [
                    ['name', 'ASC'],
                    [Spending, 'purchase_date', 'DESC'] // Сначала новые расходы
                ]
            })

            // Форматируем ответ
            const stats = usersWithSpendings.map(user => ({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.img,
                totalSpent: user.spendings.reduce((sum, spending) => sum + spending.amount, 0),
                transactionsCount: user.spendings.length,
                spendings: user.spendings.map(spending => ({
                    id: spending.id,
                    amount: spending.amount,
                    date: spending.purchase_date,
                    category: spending.category ? {
                        id: spending.category.id,
                        name: spending.category.name,
                        color: spending.category.color
                    } : null
                }))
            }))

            return res.json({
                users: stats,
                totalUsers: stats.length,
                totalSpent: stats.reduce((sum, user) => sum + user.totalSpent, 0),
                totalTransactions: stats.reduce((sum, user) => sum + user.transactionsCount, 0),
                generatedAt: new Date().toISOString()
            })

        } catch (e) {
            next(ApiError.internal('Ошибка при получении статистики: ' + e.message))
        }
    }

}

module.exports = new UserController()