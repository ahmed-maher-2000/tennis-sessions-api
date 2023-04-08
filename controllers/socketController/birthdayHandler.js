const Models = require('../../models')
const cron = require('node-cron')

module.exports = (io) => {
    const birthdayTask = cron.schedule('* 9 * * *', async () => {
        const today = new Date(Date.now())
        let users = await Models.User.find()
            .select('+birthday +name +role')
            .lean()

        users = users.filter((user) => {
            let birthday = new Date(user.birthday)

            return (
                birthday &&
                birthday.getDate() === today.getDate() &&
                birthday.getMonth() === today.getMonth()
            )
        })

        if (users.length > 0) {
            users = users.map((user) => {
                return {
                    type: 'birthday',
                    user: user._id,
                    description: `${user.role} ${user.name}'s birhday is today.`,
                }
            })

            const events = await Models.Event.create(users)

            // Get All Sockets Of Admin and Manager Users
            let sockets = await io.fetchSockets()

            sockets = sockets.filter(
                (sock) =>
                    sock.user?.role === 'admin' || sock.user?.role === 'manager'
            )

            sockets.forEach((adminSocket) => {
                io.to(adminSocket.id).emit('birthday', events)
            })
        }
    })

    birthdayTask.start()
}
