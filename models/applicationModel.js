const { Schema, model, Types } = require('mongoose')
const validator = require('validator')

const applicationSchema = new Schema(
    {
        name: {
            type: String,
            require: [true, 'Please, provide your name.'],
            minLength: [5, 'Name must be more than 5 characters'],
            maxLength: [60, 'Name must be less than 60 characters'],
            trim: true,
        },
        nickname: {
            type: String,
            require: [true, 'Please, provide your nickname.'],
            minLength: [5, 'Nickname must be more than 5 characters'],
            maxLength: [20, 'Nickname must be less than 20 characters'],
            trim: true,
        },

        address: {
            type: String,
            require: [true, 'Please, provide your address.'],
            minLength: [5, 'Address must be more than 5 characters'],
            maxLength: [100, 'Address must be less than 100 characters'],
            trim: true,
        },

        phoneNumber: {
            type: String,
            require: [true, 'Please, provide your phone number.'],
            validate: [
                function (phone) {
                    return validator.isMobilePhone(phone, ['ar-EG'])
                },
                'Phone number is invalid.',
            ],
            unique: true,
        },

        email: {
            type: String,
            require: [true, 'Please, provide your email.'],
            validate: [validator.isEmail, 'Please, provide a valid email.'],
            minLength: [10, 'Email must be more than 5 characters'],
            maxLength: [60, 'Email must be less than 60 characters'],
            trim: true,
            unique: true,
        },

        school: {
            type: String,
            require: [true, 'Please, provide your school.'],
            minLength: [5, 'School must be more than 5 characters'],
            maxLength: [30, 'School must be less than 30 characters'],
            trim: true,
        },

        appliedFor: [
            {
                type: Types.ObjectId,
                ref: 'Academy',
            },
        ],

        birthday: {
            type: Date,
            validate: [
                function (date) {
                    return new Date() > date
                },
                'Invalid birthday.',
            ],
        },

        parents: {
            father: {
                name: {
                    type: String,
                    require: [true, 'Please, provide your father name.'],
                    minLength: [5, 'Name must be more than 5 characters'],
                    maxLength: [60, 'Name must be less than 60 characters'],
                    trim: true,
                },

                phoneNumber: {
                    type: String,
                    require: [
                        true,
                        'Please, provide your father phone number.',
                    ],
                    validate: [
                        function (phone) {
                            return validator.isMobilePhone(phone, ['ar-EG'])
                        },
                        'Phone number is invalid.',
                    ],
                },

                email: {
                    type: String,
                    require: [true, 'Please, provide your father email.'],
                    validate: [
                        validator.isEmail,
                        'Please, provide a valid email.',
                    ],
                    minLength: [10, 'Email must be more than 5 characters'],
                    maxLength: [60, 'Email must be less than 60 characters'],
                    trim: true,
                    select: false,
                },

                occupation: {
                    type: String,
                    require: [true, 'Please, provide your father occupation.'],
                    minLength: [2, 'occupation must be more than 2 characters'],
                    maxLength: [
                        60,
                        'occupation must be less than 60 characters',
                    ],
                    trim: true,
                },
            },

            mother: {
                name: {
                    type: String,
                    require: [true, 'Please, provide your mother name.'],
                    minLength: [5, 'Name must be more than 5 characters'],
                    maxLength: [60, 'Name must be less than 60 characters'],
                    trim: true,
                },

                phoneNumber: {
                    type: String,
                    require: [
                        true,
                        'Please, provide your mother phone number.',
                    ],
                    validate: [
                        function (phone) {
                            return validator.isMobilePhone(phone, ['ar-EG'])
                        },
                        'Phone number is invalid.',
                    ],
                },

                email: {
                    type: String,
                    require: [true, 'Please, provide your mother email.'],
                    validate: [
                        validator.isEmail,
                        'Please, provide a valid email.',
                    ],
                    minLength: [10, 'Email must be more than 5 characters'],
                    maxLength: [60, 'Email must be less than 60 characters'],
                    trim: true,
                    select: false,
                },

                occupation: {
                    type: String,
                    require: [true, 'Please, provide your mother occupation.'],
                    minLength: [2, 'occupation must be more than 2 characters'],
                    maxLength: [
                        60,
                        'occupation must be less than 60 characters',
                    ],
                    trim: true,
                },
            },
        },

        hasMedicalCondition: {
            type: Boolean,
            default: false,
        },

        note: {
            type: String,
            maxLength: [100, 'Note must be less than 100 characters'],
        },
        acceptedAt: {
            type: Date,
            select: false,
        },
    },
    { timestamps: true }
)

applicationSchema.index({
    name: 'text',
})

module.exports = model('Application', applicationSchema)
