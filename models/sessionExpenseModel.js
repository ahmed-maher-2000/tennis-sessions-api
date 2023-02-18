const { Types, Schema, model } = require('mongoose')
const User = require('./userModel')

const sessionEspenseSchema = new Schema(
    {
        session: {
            type: Types.ObjectId,
            ref: 'Session',
        },

        player: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

paymentSchema.pre('save', async function (next) {
    await User.findByIdAndUpdate(this.player, {
        sessions: {
            $sum: -1,
        },
    })

    next()
})

module.exports = model('SessionExpense', sessionEspenseSchema)
