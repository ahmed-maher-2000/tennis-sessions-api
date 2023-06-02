const Models = require('../models')
const AppError = require('../utils/appError')
const { StatusCodes } = require('http-status-codes')
const catchAsync = require('../utils/catchAsync')
const Token = require('./authController/Token')
const qrcodeGenerator = require('../utils/qrCodeGenerator')

exports.generateUser = catchAsync(async (req, res, next) => {
    const { _id, name } = req.user
    const qr = await qrcodeGenerator(JSON.stringify({ _id, name }))
    res.status(StatusCodes.OK).send(qr)
})
