const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllAcademys = factoryHandler.getAll(Models.Academy)

exports.getAcademy = factoryHandler.getOne(Models.Academy)

exports.createAcademy = factoryHandler.createOne(Models.Academy)

exports.updateAcademy = factoryHandler.updateOne(Models.Academy)

exports.deleteAcademy = factoryHandler.deleteOne(Models.Academy)

exports.searchAcademy = factoryHandler.search(Models.Academy)
