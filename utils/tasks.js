const Models = require('../models')
const cron = require('node-cron')
const moment = require('moment')

// every day hour 9:00
exports.birthday = cron.schedule('0 0 9 * * *', async () => {
    const DateNow = moment(Date.now())
    console.log(DateNow.format('D'), DateNow.format('M'))
    let users = await Models.User.find({
        $expr: {
            $and: [
                { $eq: [{ $dayOfMonth: '$birthday' }, DateNow.format('D')] },
                { $eq: [{ $month: '$birthday' }, DateNow.format('M')] },
            ],
        },
    })
        .select('+birthday +name +role')
        .lean()

    console.log(users)
})
