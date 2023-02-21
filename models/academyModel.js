const { Schema, model } = require('mongoose')
const academySchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'Please, provide academy name.'],
            minLength: [5, 'academy must be more than 5 characters'],
            maxLength: [60, 'academy must be less than 60 characters'],
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
)

module.exports = model('Academy', academySchema)
