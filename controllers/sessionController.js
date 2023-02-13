const Models = require('../models')
const factoryHandler = require('./factoryHandler')
const AppError = require('../utils/appError')
const { StatusCodes } = require('http-status-codes')

exports.getAllSessions = factoryHandler.getAll(Models.Session)

exports.getSession = factoryHandler.getOne(Models.Session)

exports.createSession = factoryHandler.createOne(Models.Session)

exports.updateSession = factoryHandler.updateOne(Models.Session)

exports.deleteSession = factoryHandler.deleteOne(Models.Session)

exports.searchSession = factoryHandler.search(Models.Session)
