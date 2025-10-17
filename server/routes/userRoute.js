const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const authMiddleWare = require('../middleware/authMiddleWare')
const roleCheckMiddleWare = require('../middleware/roleCheckMiddleWare');


router.get('/auth', authMiddleWare, userController.check)
router.get('/stats', roleCheckMiddleWare('ADMIN'), userController.getStats)
router.post('/login', userController.login)
router.post('/registration', userController.registration)
router.patch('/update', userController.update)
router.delete('/delete', userController.delete)

module.exports = router