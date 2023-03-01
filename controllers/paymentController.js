const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllPayments = factoryHandler.getAll(Models.Payment)

exports.getPayment = factoryHandler.getOne(Models.Payment)

exports.createPaymentMiddleware = (req, res, next) => {
    const { _id: userId } = req.user
    req.body.createdBy = userId
    next()
}

exports.createPayment = factoryHandler.createOne(Models.Payment)

exports.updatePayment = factoryHandler.updateOne(Models.Payment)

exports.deletePayment = factoryHandler.deleteOne(Models.Payment)
