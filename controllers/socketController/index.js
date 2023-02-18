let isExecuted = false
const birthdayEvent = require('./birthdayEvent')

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`${socket.id} is connected.`)

        // Tasks to run
        // - execute birthdays events
        // - create event join session

        if (!isExecuted) birthdayEvent(io)
        socket.on('disconnect', () => {
            console.log(`${socket.id} is disconnected.`)
        })
    })
}
