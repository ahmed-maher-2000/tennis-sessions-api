const { Schema, model, Types } = require('mongoose')
const scoreSchema = new Schema(
    {
        player: {
            type: Types.ObjectId,
            ref: 'User',
        },
        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
        },
        points: {
            type: Number,
            default: 0,
        },
        session: {
            type: Types.ObjectId,
            ref: 'Session',
        },
    },
    { timestamps: true }
)

scoreSchema.pre(/^find/, function (next) {
    this.find()
        .populate({
            path: 'player',
            select: {
                photo: 1,
                name: 1,
                role: 1,
            },
        })
        .populate({
            path: 'createdBy',
            select: {
                photo: 1,
                name: 1,
                role: 1,
            },
        })
        .populate({
            path: 'session',
            select: {
                name: 1,
            },
        })
    next()
})

module.exports = model('Score', scoreSchema)
