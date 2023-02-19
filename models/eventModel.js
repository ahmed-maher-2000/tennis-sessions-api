const { Types, Schema, model } = require('mongoose')

const eventSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['birthday'],
            trim: true,
            lower: true,
        },

        user: {
            type: Types.ObjectId,
            ref: 'User',
        },

        description: {
            type: String,
        },
    },
    { timestamps: true }
)

eventSchema.index(
    {
        type: 1,
        user: 1,
    },
    {
        unique: true,
    }
)

eventSchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'user',
        select: {
            name: 1,
            photo: 1,
        },
    })

    next()
})

module.exports = model('Event', eventSchema)
