const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const Models = require('../../models')

module.exports = (socket) => {
    return async (token) => {
        const { _id: userId } = socket.user
        if (!token)
            return next(new Error('You can not join session without qrcode.'))

        const decoded = await promisify(jwt.verify)(
            token,
            process.env.JWT_SECRET
        )

        const session = await Models.Session.findById(decoded._id)

        if (!session) return next(new Error('Session is not found'))

        if (session.players.includes(userId))
            return next(new Error('You already joined in the session.'))

        session.players.push(userId)
        await session.save({ validateBeforeSave: false })

        socket.emit('joinSessionSuccess', session)
    }
}
