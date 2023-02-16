const { StatusCodes } = require('http-status-codes')
const Models = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const Sender = require('../utils/Sender')
const factoryHandler = require('./factoryHandler')

exports.getAllRequests = factoryHandler.getAll(Models.Request)

exports.getRequest = factoryHandler.getOne(Models.Request)

exports.createRequest = factoryHandler.createOne(Models.Request)

exports.updateRequest = factoryHandler.updateOne(Models.Request)

exports.deleteRequest = factoryHandler.deleteOne(Models.Request)

exports.searchRequest = factoryHandler.search(Models.Request)

exports.acceptOrRefuseRequest = catchAsync(async (req, res, next) => {
    const { isAccepted } = req.body
    const { id: requestId } = req.params

    const request = await Models.Request.findById(requestId)

    if (!request)
        return next(
            new AppError('Request is not found.', StatusCodes.NOT_FOUND)
        )

    if (isAccepted === true) {
        const user = await Models.User.create({
            email: request.email,
            name: request.name,
            nickname: request.nickname,
            address: request.address,
            phoneNumber: request.phoneNumber,
            appliedFor: request.appliedFor,
            password: 'default1234',
            passwordConfirm: 'default1234',
        })

        await Models.Request.findByIdAndUpdate(request._id, {
            acceptedAt: new Date(Date.now()),
        })

        user.password = undefined

        Sender.send(res, StatusCodes.CREATED, user, {
            message:
                'this application is accepted and this player can login from now.',
        })
    } else {
        await Models.Request.findByIdAndDelete(requestId)

        Sender.send(res, StatusCodes.OK, undefined, {
            message: 'this application is refused.',
        })
    }
})
