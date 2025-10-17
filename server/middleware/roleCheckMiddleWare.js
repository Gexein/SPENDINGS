const jwt = require('jsonwebtoken')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') { return next() }


        try {
            const authHeader = req.headers.authorization
            if (!authHeader) {
                return res.status(401).json({ message: 'Пользователь не авторизован, в заголовках отсутствует поле authorization' })
            }
            const token = authHeader.split(' ')[1] // Bearer(0) и сам токен(1)
            if (!token) {
                return res.status(401).json({ message: 'Пользователь не авторизован' })
            }
            const decoded = jwt.verify(token, process.env.SECRET)
            if (decoded.role !== role) {
                return res.status(403).json({ message: 'Недостаточно прав пользователя на этой роли' })
            }
            req.user = decoded
            next()

        } catch (e) {
            res.status(401).json({ message: e.message })
        }
    }
}