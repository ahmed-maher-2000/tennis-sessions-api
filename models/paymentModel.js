const { Types, Schema, model } = require('mongoose')
const User = require('./userModel')
const config = require('../config')

const paymentSchema = new Schema(
    {
        sessions: {
            type: Number,
            default: config.sessionsCount,
        },

        player: {
            type: Types.ObjectId,
            ref: 'User',
        },

        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

paymentSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'player',
        select: {
            name: 1,
            photo: 1,
        },
    })

    next()
})

paymentSchema.post('save', async function () {
    await User.findByIdAndUpdate(this.player, {
        $inc: {
            sessions: this.sessions,
        },
    })
})
module.exports = model('Payment', paymentSchema)
