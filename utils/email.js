const { htmlToText } = require('html-to-text')
const emailTemplate = require('../templates/emailTemplate')
const sgMail = require('@sendgrid/mail')

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email
        this.firstName = user.name.split(' ')[0]
        this.url = url
        this.from = `${process.env.EMAIL_FROM}`
    }

    // Send the actual email
    async sendPasswordReset() {
        const html = emailTemplate(
            this.firstName,
            this.url,
            'Forget your password'
        )
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        // 2) Define email options
        const msg = {
            from: this.from,
            to: this.to,
            subject: 'Password Reset',
            html,
            text: htmlToText(html),
        }

        // 3) Create a transport and send email
        await sgMail.send(msg)
    }

    async sendAddPassword() {
        const html = emailTemplate(
            this.firstName,
            this.url,
            'Add your password'
        )
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
            from: this.from,
            to: this.to,
            subject: 'Submit Password',
            html,
            text: htmlToText(html),
        }

        await sgMail.send(msg)
    }
}
