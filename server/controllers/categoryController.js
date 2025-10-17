const { Category } = require('../models/models')
const { Spending } = require('../models/models')
const ApiError = require('../error/apiError')
const isStringValid = require('../lib/utils/isStringValid')

class CategoryController {
    async create(req, res, next) {
        try {
            const { name, color, userId } = req.body
            if (!name) {
                return next(ApiError.badRequest('В теле запроса отсутствует название новой категории'))
            }

            if (!userId) {
                return next(ApiError.badRequest('В теле запроса отсутствует id пользователя, которому принадлежит новая категория'))
            }

            const existingCategory = await Category.findOne({
                where: {
                    name: name.toLowerCase(),
                    userId: userId
                }
            })

            if (existingCategory) {
                return next(ApiError.conflict('Категория с таким названием уже существует'))
            }

            const category = await Category.create({ name: name.toLowerCase(), color, userId })
            return res.json(category)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getAll(req, res, next) {
        try {
            const { userId, id } = req.query
            if (!userId) {
                return next(ApiError.badRequest('В параметрах запроса отсутствует ID пользователя'))
            }
            let categories
            if (!id) {
                categories = await Category.findAll({
                    where: {
                        userId: userId
                    }
                })
            }

            if (id) {
                categories = await Category.findAll({
                    where: {
                        userId: userId,
                        id: id
                    }
                })
            }
            if (categories.length === 0) {
                return next(ApiError.badRequest('Категории для данного пользователя не найдены!'))
            }
            return res.json(categories)
        } catch (e) {
            next(ApiError.internal(e.message))
        }
    }


    async update(req, res, next) {
        try {
            const { newName, newColor, id, userId } = req.body
            if (!id) {
                return next(ApiError.badRequest('В теле запроса отсутствует ID обновляемой категории'))
            }

            if (!userId) {
                return next(ApiError.badRequest('В теле запроса отсутствует ID пользователя'))
            }
            const category = await Category.findOne({
                where: {
                    id: id,
                    userId: userId
                }
            })
            if (!category) {
                return next(ApiError.badRequest('Категория с таким ID не найдена'))
            }
            if (isStringValid(newName)) {
                if (category.name == newName.toLowerCase()) {
                    return next(ApiError.badRequest('Попытка присвоить старое имя категории'))
                }
            }
            const updateData = {}
            if (isStringValid(newName)) { updateData.name = newName.toLowerCase() }
            if (isStringValid(newName)) { updateData.color = newColor }
            if (Object.keys(updateData).length === 0) {
                return next(ApiError.badRequest('В теле запроса отсутствуют данные для обновления name || color'))
            }
            await category.update(updateData)
            return res.json(category)
        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async delete(req, res, next) {
        try {
            const { id, userId } = req.body
            if (!id || !userId) {
                return next(ApiError.badRequest('В теле запроса должны присутствовать id категории и id пользователя'))
            }
            const category = await Category.findOne({
                where: {
                    id: id,
                    userId: userId
                }
            })

            if (!category) {
                return next(ApiError.badRequest('Категория с таким ID не найдена'))
            }
            await Spending.update(
                { categoryId: null },
                {
                    where: {
                        userId: userId,
                        categoryId: id
                    }
                }
            )

            await category.destroy()
            return res.json({ message: 'Категория успешно удалена!' })

        }
        catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

}

module.exports = new CategoryController()