const Models = require('../../models')

module.exports = (io) => {
    const dayInMS = 1000 //24 * 60 * 60 * 1000

    setInterval(async () => {
        const nowInMS = Date.now()

        let users = await Models.User.find({
            birthday: {
                $gte: new Date(nowInMS).toDateString(),
                $lt: new Date(nowInMS + dayInMS).toDateString(),
            },
        }).select('+birthday +name +role')

        if (users.length > 0) {
            users = users.map((user) => {
                return {
                    type: 'birthday',
                    user: user._id,
                    description: `${user.role} ${user.name}'s birhday is today.`,
                }
            })

            console.log(users)

            const events = await Models.Event.create(users)

            // Get All Sockets Of Admin and Manager Users
            const sockets = io.sockets
                .clients()
                .filter(
                    (sock) =>
                        sock.user?.role === 'admin' ||
                        sock.user?.role === 'manager'
                )

            sockets.forEach((adminSocket) => {
                io.to(adminSocket.id).emit('birthday', events)
            })
        }
    }, dayInMS)
}
