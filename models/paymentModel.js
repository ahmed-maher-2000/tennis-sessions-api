const { Types, Schema, model } = require('mongoose')
const Package = require('./packageModel')
const User = require('./userModel')

const paymentSchema = new Schema(
    {
        package: {
            type: Types.ObjectId,
            ref: 'Package',
        },

        sessions: {
            type: Number,
            default: 1,
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

paymentSchema.pre('save', async function (next) {
    const package = await Package.findById(this.package)
    this.sessions = package.sessions
    next()
})

paymentSchema.pre(/^find/, function (next) {
    this.find()
        .populate({
            path: 'createdBy',
            select: {
                name: 1,
                photo: 1,
            },
        })
        .populate({
            path: 'player',
            select: {
                name: 1,
                photo: 1,
            },
        })
        .populate({
            path: 'package',
            select: {
                sessions: 1,
                price: 1,
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
