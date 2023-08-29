const catchAsync = require('../../utils/catchAsync')
const Models = require('../../models')
const AppError = require('../../errors/AppError')
const Token = require('./Token')
const { StatusCodes } = require('http-status-codes')
const Sender = require('../../services/Sender')
const Email = require('../../services/Email')
const crypto = require('crypto')

// exports.signup = catchAsync(async (req, res, next) => {
//     const { name, email, password, passwordConfirm } = req.body

//     let user = await Models.User.create({
//         name,
//         email,
//         password,
//         passwordConfirm,
//     })

//     Token.sendUser(res, StatusCodes.CREATED, user)
// })

exports.login = catchAsync(async (req, res, next) => {
    const { password, email } = req.body

    if (!email || !password)
        return next(
            new AppError(
                'Please, provide email or password',
                StatusCodes.BAD_REQUEST
            )
        )

    const user = await Models.User.findOne({
        email,
    }).select('+password +email')

    if (!user || !(await user.correctPassword(user.password, password)))
        return next(
            new AppError(
                'Incorrect email or password.',
                StatusCodes.BAD_REQUEST
            )
        )

    Token.sendUser(res, StatusCodes.OK, user)
})

exports.logout = catchAsync((req, res, next) => {
    Sender.send(res.clearCookie('jwt'), StatusCodes.OK, undefined, {
        message: 'You logged out successfully.',
    })
})

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body
    const user = await Models.User.findOne({ email }).select('+email')
    if (!user)
        return next(
            new AppError(
                'There is no user with this email.',
                StatusCodes.BAD_REQUEST
            )
        )
    const resetToken = user.createPasswordResetToken()
    await user.save({ validateBeforeSave: false })

    try {
        const URL = `${req.protocol}/://${req.hostname}/reset-password?token=${resetToken}`
        await new Email(user, URL).sendPasswordReset()

        Sender.send(res, StatusCodes.OK, undefined, {
            message: 'Token is sent to your email.',
        })
    } catch (error) {
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save({ validateBeforeSave: false })

        console.log(error)
        return next(
            new AppError(
                'There was an error sending the email. Try again later',
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        )
    }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
    const { token } = req.params
    const { password, passwordConfirm } = req.body
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await Models.User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires')

    if (!user)
        return next(
            new AppError(
                'Token is invalid or has expired',
                StatusCodes.BAD_REQUEST
            )
        )

    user.password = password
    user.passwordConfirm = passwordConfirm
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined

    await user.save()
    Token.sendUser(res, StatusCodes.OK, user)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
    const { password, newPassword, newPasswordConfirm } = req.body
    const user = await Models.User.findById(req.user._id).select('+password')
    const isPasswordCorrect = await user.correctPassword(
        user.password,
        password
    )

    if (!isPasswordCorrect)
        return next(
            new AppError(
                'The old password is incorrect.',
                StatusCodes.BAD_REQUEST
            )
        )

    user.password = newPassword
    user.passwordConfirm = newPasswordConfirm

    await user.save()

    Token.sendUser(res, StatusCodes.OK, user)
})
