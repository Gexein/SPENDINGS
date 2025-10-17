const Router = require('express')
const router = new Router()
const categoryController = require('../controllers/categoryController')


router.get('/', categoryController.getAll)
router.post('/create', categoryController.create)
router.patch('/update', categoryController.update)
router.delete('/delete', categoryController.delete)


module.exports = router