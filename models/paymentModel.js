const { Types, Schema, model } = require('mongoose')
const User = require('./userModel')
const Package = require('./packageModel')

const paymentSchema = new Schema(
    {
        package: {
            type: Types.ObjectId,
            ref: 'Package',
        },

        value: {
            type: Number,
            default: 0,
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

    await User.findByIdAndUpdate(this.player, {
        sessions: {
            $sum: package.sessions,
        },
    })

    next()
})

packageSchema.pre(/^find/, function (next) {
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
module.exports = model('Payment', paymentSchema)
