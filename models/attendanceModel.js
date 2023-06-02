const { Types, Schema, model } = require('mongoose')
const moment = require('moment')

const attendanceSchema = new Schema(
    {
        user: {
            type: Types.ObjectId,
            ref: 'User',
        },

        day: {
            type: String,
            default: moment(Date.now()).format('YYYY-MM-DD'), // YYYY-MM-DD
        },

        status: {
            type: String,
            lower: true,
            trim: true,
            enum: ['presence' , 'absence'],
            default: 'presence'
        },

        createdBy: {
            type: Types.ObjectId,
            ref: 'User'
        }
    },
    { timestamps: true }
)

attendanceSchema.index(
    {
        user: 1,
        day: 1,
    },
    {
        unique: true,
    }
)

attendanceSchema.pre(/^find/, function (next) {
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

module.exports = model('Attendance', attendanceSchema)
