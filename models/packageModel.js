const { Types, Schema, model } = require('mongoose')

const packageSchema = new Schema(
    {
        sessions: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: 0,
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
)

packageSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'createdBy',
        select: {
            name: 1,
            photo: 1,
            role: 1,
        },
    })
    next()
})

module.exports = model('Package', packageSchema)
