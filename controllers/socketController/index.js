const protectHandler = require('./protectMiddlewareHandler')
const joinSessionHandler = require('./joinSessionHandler')
const birthdayHandler = require('./birthdayHandler')

exports.protect = protectHandler
exports.birthdayHandler = birthdayHandler

exports.connectionHandler = (io) => {
    return (socket) => {
        console.log(
            `user ${socket.user.name} is connected with id: ${socket.id}.`
        )

        // join session by qrcode token
        socket.on('joinSession', joinSessionHandler(socket))

        socket.on('error', (err) => {
            if (err) socket.disconnect()
        })
        // socket.on('joinSession', (token) => {})
        socket.on('disconnect', () => {
            console.log(`user ${socket.user.name} is disconnected.`)
        })
    }
}
