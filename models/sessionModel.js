const { Types, Schema, model } = require('mongoose')
const sessionSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'Please, provide session name.'],
            minLength: [5, 'Name must be more than 5 characters'],
            maxLength: [60, 'Name must be less than 60 characters'],
            trim: true,
        },

        trainer: {
            type: Types.ObjectId,
            ref: 'User',
        },

        createdBy: {
            type: Types.ObjectId,
            ref: 'User',
        },

        startedAt: {
            type: Date,
        },
        endedAt: {
            type: Date,
        },

        players: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
    },
    { timestamps: true }
)

sessionSchema.index({
    name: 'text',
})

module.exports = model('Session', sessionSchema)
