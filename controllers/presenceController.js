const { StatusCodes } = require('http-status-codes')
const Models = require('../models')
const AppError = require('../utils/appError')
const factoryHandler = require('./factoryHandler')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const Sender = require('../utils/Sender')

exports.getAllPresences = factoryHandler.getAll(Models.Presence)

exports.getPresence = factoryHandler.getOne(Models.Presence)

exports.createPresenceMiddleware = async (req, res, next) => {
    const { _id: userId } = req.user
    const { token } = req.params

    if (!token)
        return next(
            new AppError(
                'Please, provide qrcode token',
                StatusCodes.BAD_REQUEST
            )
        )

    try {
        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        )

        const user = await Models.User.findOne({
            _id: decoded.id,
            role: 'admin',
        })

        if (!user)
            return next(
                new AppError(
                    'This qrcode token do not has permissions to this action.',
                    StatusCodes.BAD_REQUEST
                )
            )

        const presence = await Models.Presence.create({
            user: userId,
            day: decoded.day,
        })

        Sender.send(res, StatusCodes.CREATED, presence)
    } catch (err) {
        next(err)
    }
}
exports.createPresence = factoryHandler.createOne(Models.Presence)

exports.updatePresence = factoryHandler.updateOne(Models.Presence)

exports.deletePresence = factoryHandler.deleteOne(Models.Presence)
