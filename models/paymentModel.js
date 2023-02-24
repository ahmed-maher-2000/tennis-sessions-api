const { Types, Schema, model } = require('mongoose')
const User = require('./userModel')
const Salary = require('./salaryModel')

const paymentSchema = new Schema(
    {
        salary: {
            type: Types.ObjectId,
            ref: 'Salary',

            validate: [
                async function (salary) {
                    const document = await Salary.findById(salary)
                    return document ? true : false
                },
                'Invalid salary.',
            ],
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
    const salary = await Salary.findById(this.salary)
    this.price = salary.price * this.sessions
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
            path: 'salary',
            select: {
                traier: 1,
                price: 1,
            },
        })

    next()
})
module.exports = model('Payment', paymentSchema)
