const protectHandler = require('./protectMiddlewareHandler')
const birthdayHandler = require('./birthdayHandler')

exports.protect = protectHandler
exports.birthdayHandler = birthdayHandler

exports.connectionHandler = (io) => {
    return (socket) => {
        console.log(
            `user ${socket.user.name} is connected with id: ${socket.id}.`
        )

        socket.on('error', (err) => {
            if (err) socket.disconnect()
        })
        socket.on('disconnect', () => {
            console.log(`user ${socket.user.name} is disconnected.`)
        })
    }
}
