const { Types, Schema, model } = require('mongoose')

const presenceSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'User',
        },

        day: {
            type: String,
            default: new Date(Date.now()).toISOString().split('T')[0], // YYYY-MM-DD
        },
    },
    { timestamps: true }
)

presenceSchema.index(
    {
        user: 1,
        day: 1,
    },
    {
        unique: true,
    }
)

presenceSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'user',
        select: {
            name: 1,
            role: 1,
            photo: 1,
        },
    })
    next()
})

module.exports = model('Presence', presenceSchema)
