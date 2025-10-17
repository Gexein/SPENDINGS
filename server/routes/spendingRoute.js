const Router = require('express')
const router = new Router()
const spendingController = require('../controllers/spendingController')


router.get('/', spendingController.getAll)
// router.get('/:id', spendingController.getOne)
router.post('/create', spendingController.create)
router.delete('/delete', spendingController.delete)
router.patch('/update', spendingController.update)


module.exports = router