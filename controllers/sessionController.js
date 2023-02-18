const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllSessions = factoryHandler.getAll(Models.Session)

exports.getSession = factoryHandler.getOne(Models.Session)

exports.createSessionMiddleware = (req, res, next) => {
    const { _id: userId } = req.user
    req.body.createdBy = userId
}
exports.createSession = factoryHandler.createOne(Models.Session)

exports.updateAndDeleteSessionMiddleware = (req, res, next) => {
    const { _id: userId } = req.user
    req.filterOptions.createdBy = userId
}
exports.updateSession = factoryHandler.updateOne(Models.Session)

exports.deleteSession = factoryHandler.deleteOne(Models.Session)

exports.searchSession = factoryHandler.search(Models.Session)
