const Models = require('../../models')

module.exports = (io) => {
    const dayInMS = 24 * 60 * 60 * 1000

    setInterval(async () => {
        const users = await Models.User.find({
            birthday: {
                $gte: new Date(Date.now()).toDateString(),
                $lt: new Date(Date.now() + dayInMS).toDateString(),
            },
        }).select('birthday')

        if (users.length > 0) {
            console.log(users)
            const sockets = io.sockets.clients()

            const admins = sockets.filter(
                (sock) =>
                    sock.user?.role === 'admin' || sock.user?.role === 'manager'
            )

            admins.forEach((adminSocket) => {
                io.to(adminSocket.id).emit('birthday')
            })
        }
    }, dayInMS)
}
