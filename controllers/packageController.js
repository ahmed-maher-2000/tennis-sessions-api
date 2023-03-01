const Models = require('../models')
const factoryHandler = require('./factoryHandler')

exports.getAllPackages = factoryHandler.getAll(Models.Package)

exports.getPackage = factoryHandler.getOne(Models.Package)

exports.createPackageMiddleware = (req, res, next) => {
    const { _id: userId } = req.user
    req.body.createdBy = userId
    next()
}

exports.createPackage = factoryHandler.createOne(Models.Package, {
    path: 'createdBy',
    select: {
        name: 1,
        photo: 1,
        role: 1,
    },
})

exports.updatePackage = factoryHandler.updateOne(Models.Package)

exports.deletePackage = factoryHandler.deleteOne(Models.Package)
