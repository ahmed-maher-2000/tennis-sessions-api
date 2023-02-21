const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllPackages = factoryHandler.getAll(Models.Package)

exports.getPackage = factoryHandler.getOne(Models.Package)

exports.createPackage = factoryHandler.createOne(Models.Package)

exports.updatePackage = factoryHandler.updateOne(Models.Package)

exports.deletePackage = factoryHandler.deleteOne(Models.Package)
