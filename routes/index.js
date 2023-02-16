const User = require('./userRoutes')
const Auth = require('./authRoutes')
const Upload = require('./uploadRoutes')
const Session = require('./sessionRoutes')
const Qrcode = require('./qrcodeRoutes')
const Request = require('./requestRoutes')
const Academy = require('./academyRoutes')

module.exports = {
    User,
    Auth,
    Request,
    Academy,
    Upload,
    Session,
    Qrcode,
}
