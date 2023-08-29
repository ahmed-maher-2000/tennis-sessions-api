const { StatusCodes } = require('http-status-codes')
const Models = require('../models')
const AppError = require('../errors/AppError')
const factoryHandler = require('./factoryHandler')

exports.getAllAttendances = factoryHandler.getAll(Models.Attendance)

exports.getAttendance = factoryHandler.getOne(Models.Attendance)

exports.createAttendanceMiddleware = async (req, res, next) => {
    try {
        const { _id: createdById } = req.user
        const { userId } = req.body

        const user = await Models.User.findById(userId)
        if (!user)
            return next(
                new AppError(
                    `No user with this id: ${userId}`,
                    StatusCodes.NOT_FOUND
                )
            )
        req.body = {
            createdBy: createdById,
            user: userId,
        }
        next()
    } catch (error) {
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
