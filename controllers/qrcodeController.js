const Models = require('../models')
const factoryHandler = require('./factoryHandler')
const AppError = require('../utils/appError')
const { StatusCodes } = require('http-status-codes')
const catchAsync = require('../utils/catchAsync')
const Token = require('./authController/Token')
const qrcode = require('qrcode')

exports.generateSessionJoin = catchAsync(async (req, res, next) => {
    const { _id: userId } = req.user
    const { id: sessionId } = req.params

    const session = await Models.Session.find({
        _id: sessionId,
        endedAt: {
            $gt: new Date(Date.now()),
        },
    })

    if (!session)
        return next(
            new AppError('Session is not found.', StatusCodes.NOT_FOUND)
        )

    const expiredTime = new Date(session.endedAt) - Date.now()
    const token = Token.sign({ userId, sessionId }, expiredTime)

    const qr = qrcode.toDataURL(token)

    res.status(StatusCodes.OK).send(qr)
})
