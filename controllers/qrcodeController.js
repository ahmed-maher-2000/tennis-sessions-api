const Models = require('../models')
const AppError = require('../utils/appError')
const { StatusCodes } = require('http-status-codes')
const catchAsync = require('../utils/catchAsync')
const Token = require('./authController/Token')
const qrcodeGenerator = require('../utils/qrCodeGenerator')

exports.generateSession = catchAsync(async (req, res, next) => {
    const { id: sessionId } = req.params

    const session = await Models.Session.findById(sessionId)

    if (!session)
        return next(
            new AppError('Session is not found.', StatusCodes.NOT_FOUND)
        )
    const qr = await qrcodeGenerator(token)

    res.status(StatusCodes.OK).send(qr)
})

exports.generatePresence = catchAsync(async (req, res, next) => {
    const { id: adminId } = req.user

    const user = await Models.User.findById(adminId)

    if (!user)
        return next(new AppError('User is not found.', StatusCodes.NOT_FOUND))

    const expiredTime = 8 * 60 * 60 * 1000 // 8 hour
    const token = Token.sign(
        { id: user._id, day: new Date(Date.now()).toISOString().split('T')[0] },
        expiredTime
    )

    console.log(token)

    const qr = await qrcodeGenerator(token)

    res.status(StatusCodes.OK).send(qr)
})
