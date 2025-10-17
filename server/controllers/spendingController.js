const ApiError = require('../error/apiError')
const isStringValid = require('../lib/utils/isStringValid')
const { Spending } = require('../models/models')

class SpendingController {
    async create(req, res, next) {
        try {
            const { userId, categoryId, amount, purchase_date } = req.body
            if (!userId || !categoryId || !amount) {
                return next(ApiError.badRequest('Тело запроса должно содержать id пользователя, id категории покупки, сумму покупки и опционально - дату покупки'))
            }
            const spending = await Spending.create({ userId, categoryId, amount, purchase_date })
            res.json(spending)

        } catch (e) {
            return next(ApiError.internal(e.message))
        }
    }

    async getAll(req, res, next) {
        try {
            let { userId, page, limit, categoryId } = req.query
            page = page || 1
            limit = limit || 20
            let offset = page * limit - limit
            if (!userId) {
                return next(ApiError.badRequest('В параметрах запроса отсутствует ID пользователя'))
            }
            let where = isStringValid(categoryId) ? { userId: userId, categoryId: categoryId } : { userId: userId }
            const spendings = await Spending.findAndCountAll({
                where: where, limit, offset
            })
            if (!spendings) {
                return next(ApiError.badRequest('Траты этого пользователя не найдены'))
            }
            return res.json(spendings)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    // async getOne(req, res, next) {

    // }

    async update(req, res, next) {
        try {
            const { userId, id, amount, purchase_date, categoryId } = req.body
            if (!userId || !id) {
                return next(ApiError.badRequest('Тело запроса должно содержать id пользователя и id затраты'))
            }
            const spending = await Spending.findOne({
                where: {
                    id: id,
                    userId: userId
                }
            })
            if (!spending) {
                return next(ApiError.badRequest('Трата с id пользователя и id траты из тела запроса не найдена'))
            }
            const updatedData = {}
            if (isStringValid(amount)) { updatedData.amount = amount }
            if (isStringValid(purchase_date)) { updatedData.purchase_date = purchase_date }
            if (isStringValid(categoryId)) { updatedData.categoryId = categoryId }
            if (Object.keys(updatedData).length === 0) {
                return next(ApiError.badRequest('В теле запроса отсутствуют данные для обновления траты'))
            }
            await spending.update(updatedData)
            return res.json(spending)

        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { userId, id } = req.body
            if (!userId || !id) {
                return next(ApiError.badRequest('Тело запроса должно содержать id пользователя и id затраты'))
            }
            const spending = await Spending.findOne({
                where: {
                    id: id,
                    userId: userId
                }
            })
            if (!spending) {
                return next(ApiError.badRequest('Трата с id пользователя и id траты из тела запроса не найдена'))
            }
            await spending.destroy()
            res.json({ message: 'Трата успешно удалена' })
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }

}

module.exports = new SpendingController()