const { StatusCodes } = require('http-status-codes')
const Models = require('../models')
const AppError = require('../utils/appError')
const factoryHandler = require('./factoryHandler')

exports.getAllAttendances = factoryHandler.getAll(Models.Attendance)

exports.getAttendance = factoryHandler.getOne(Models.Attendance)

exports.createAttendanceMiddleware = async (req, res, next) => {
    try {
        const { _id: createdBy } = req.user
        const { user } = req.body

        const userData = await Models.User.findById(user)
        if (!userData)
            return next(
                new AppError(
                    `No user with this id: ${user}`,
                    StatusCodes.NOT_FOUND
                )
            )
        req.body = {
            createdBy,
            user,
        }
        next()
    } catch (error) {
        console.log(error)
        return next(
            new AppError(
                'Can not create this attendance.',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        )
    }
}
exports.createAttendance = factoryHandler.createOne(Models.Attendance)

exports.updateAttendance = factoryHandler.updateOne(Models.Attendance)

exports.deleteAttendance = factoryHandler.deleteOne(Models.Attendance)
