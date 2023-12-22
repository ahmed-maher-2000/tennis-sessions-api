const express = require('express')
const router = express.Router()
const protect = require('../middlewares/protect')
const restrictTo = require('../utils/restrictTo')
const qrcodes = require('../controllers/qrcodeController')

router.use(protect)

router.get('/getMyQrcode', qrcodes.generateUser)

module.exports = router
