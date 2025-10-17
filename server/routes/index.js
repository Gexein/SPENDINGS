const Router = require('express')
const router = new Router()
const userRouter = require('./userRoute')
const spendingRouter = require('./spendingRoute')
const categoryRouter = require('./categoryRoute')

router.use('/user', userRouter)
router.use('/category', categoryRouter)
router.use('/spending', spendingRouter)

module.exports = router