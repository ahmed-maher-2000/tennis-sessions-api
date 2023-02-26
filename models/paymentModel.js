const { Types, Schema, model } = require('mongoose')
const Package = require('./packageModel')
const User = require('./userModel')

const paymentSchema = new Schema(
    {
        package: {
            type: Types.ObjectId,
            ref: 'Package',
        },

        packageNumber: {
            type: Number,
            default: 1,
        },

        sessions: {
            type: Number,
            default: 0,
        },

        price: {
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
    this.price = package.price * this.packageNumber
    this.sessions = package.sessions * this.packageNumber

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
