const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllPayments = factoryHandler.getAll(Models.Payment)

exports.getPayment = factoryHandler.getOne(Models.Payment)

exports.createPaymentMiddleware = async (req, res, next) => {
    try {
        const { _id: createdById } = req.user
        const { playerId } = req.body

        const user = await Models.User.findById(playerId)
        if (!user)
            return next(
                new AppError(
                    `No player with this id: ${playerId}`,
                    StatusCodes.NOT_FOUND
                )
            )
        req.body = {
            createdBy: createdById,
            player: playerId,
        }
        next()
    } catch (error) {
        return next(
            new AppError(
                'Can not create this payment.',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        )
    }
}

exports.createPayment = factoryHandler.createOne(Models.Payment)

exports.updatePayment = factoryHandler.updateOne(Models.Payment)

exports.deletePayment = factoryHandler.deleteOne(Models.Payment)
