const { StatusCodes } = require('http-status-codes')
const Models = require('../models')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const Sender = require('../utils/Sender')
const factoryHandler = require('./factoryHandler')
const Email = require('../utils/email')

exports.getAllApplications = factoryHandler.getAll(Models.Application)

exports.getApplication = factoryHandler.getOne(Models.Application)

exports.createApplication = factoryHandler.createOne(Models.Application)

exports.updateApplication = factoryHandler.updateOne(Models.Application)

exports.deleteApplication = factoryHandler.deleteOne(Models.Application)

exports.searchApplication = factoryHandler.search(Models.Application)

exports.acceptOrRefuseApplication = catchAsync(async (req, res, next) => {
    const { isAccepted } = req.body
    const { id: applicationId } = req.params

    const application = await Models.Application.findById(applicationId)

    if (!application)
        return next(
            new AppError('Application is not found.', StatusCodes.NOT_FOUND)
        )

    if (isAccepted === true) {
        const user = new Models.User({
            email: application.email,
            name: application.name,
            nickname: application.nickname,
            birthday: application.birthday,
            address: application.address,
            phoneNumber: application.phoneNumber,
            appliedFor: application.appliedFor,
            application: application._id,
            password: process.env.JWT_SECRET,
            passwordConfirm: process.env.JWT_SECRET,
        })

        const resetToken = user.createPasswordResetToken(
            7 * 24 * 60 * 60 * 1000 // 7 days
        )

        await user.save()

        try {
            const URL = `http://${req.hostname}:3000/reset-password?token=${resetToken}`
            await new Email(user, URL).sendAddPassword()

            await Models.Application.findByIdAndUpdate(application._id, {
                acceptedAt: new Date(Date.now()),
            })

            user.password = undefined

            Sender.send(res, StatusCodes.OK, undefined, {
                message: 'Check the email to change the password.',
            })
        } catch (error) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save()

            console.log(error)
            return next(
                new AppError(
                    'There was an error sending the email. Try again later',
                    StatusCodes.INTERNAL_SERVER_ERROR
                )
            )
        }
    } else {
        await Models.Application.findByIdAndDelete(applicationId)

        Sender.send(res, StatusCodes.OK, undefined, {
            message: 'this application is refused.',
        })
    }
})
