const protectHandler = require('./protectMiddlewareHandler')
const joinSessionHandler = require('./joinSessionHandler')
const birthdayHandler = require('./birthdayHandler')

let isExecuted = false

exports.protect = protectHandler

exports.connectionHandler = (io) => {
    return (socket) => {
        console.log(
            `user ${socket.user.name} is connected with id: ${socket.id}.`
        )

        // join session by qrcode token
        socket.on('joinSession', joinSessionHandler(socket))

        // birthday events handler
        if (!isExecuted) birthdayHandler(io)

        socket.on('error', (err) => {
            if (err) socket.disconnect()
        })
        // socket.on('joinSession', (token) => {})
        socket.on('disconnect', () => {
            console.log(`user ${socket.user.name} is disconnected.`)
        })
    }
}
