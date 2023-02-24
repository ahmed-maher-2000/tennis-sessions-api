const { Types, Schema, model } = require('mongoose')
const salarySchema = new Schema(
    {
        trainer: {
            type: Types.ObjectId,
            ref: 'User',
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

salarySchema.pre(/^find/, function (next) {
    this.find().populate({
        path: 'trainer',
        select: {
            name: 1,
            photo: 1,
        },
    })

    next()
})

module.exports = model('Salary', salarySchema)
