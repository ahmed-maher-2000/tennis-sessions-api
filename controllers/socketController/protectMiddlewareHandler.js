const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const Models = require('../../models')

module.exports = async (socket, next) => {
    try {
        const { token } = socket.handshake?.auth

        if (!token) return next(new Error('You are not logged in'))

        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        )

        const currentUser = await Models.User.findById(decoded.id)

        if (!currentUser) {
            return next(
                new Error(
                    'The user belonging to this token does no longer exist'
                )
            )
        }

        if (currentUser.isPasswordChangedAfter(decoded.iat)) {
            return next(
                new Error(
                    'User recently changed the password! Please log in again'
                )
            )
        }

        socket.user = {
            _id: currentUser._id,
            role: currentUser.role,
            name: currentUser.name,
            photo: currentUser.photo,
        }

        next()
    } catch (error) {
        next(error)
    }
}
