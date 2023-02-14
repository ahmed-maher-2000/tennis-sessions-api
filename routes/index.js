const User = require('./userRoutes')
const Auth = require('./authRoutes')
const Upload = require('./uploadRoutes')
const Session = require('./sessionRoutes')
const Qrcode = require('./qrcodeRoutes')

module.exports = {
    User,
    Auth,
    Upload,
    Session,
    Qrcode,
}
