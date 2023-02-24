const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllSalaries = factoryHandler.getAll(Models.Salary)

exports.getSalary = factoryHandler.getOne(Models.Salary)

exports.createSalary = factoryHandler.createOne(Models.Salary)

exports.updateSalary = factoryHandler.updateOne(Models.Salary)

exports.deleteSalary = factoryHandler.deleteOne(Models.Salary)
