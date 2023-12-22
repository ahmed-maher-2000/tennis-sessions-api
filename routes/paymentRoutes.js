const express = require('express')
const router = express.Router()
const payments = require('../controllers/paymentController')
const protect = require('../middlewares/protect')
const restrictTo = require('../utils/restrictTo')

router.use(protect)

router.use(restrictTo('admin', 'manager'))
router
    .route('/')
    .get(payments.getAllPayments)
    .post(payments.createPaymentMiddleware, payments.createPayment)

router
    .route('/:id')
    .get(payments.getPayment)
    .patch(payments.updatePayment)
    .delete(payments.deletePayment)

module.exports = router
