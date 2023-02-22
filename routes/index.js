const User = require('./userRoutes')
const Auth = require('./authRoutes')
const Upload = require('./uploadRoutes')
const Session = require('./sessionRoutes')
const Qrcode = require('./qrcodeRoutes')
const Application = require('./applicationRoutes')
const Academy = require('./academyRoutes')
const Package = require('./packageRoutes')
const Presence = require('./presenceRoutes')

module.exports = {
    User,
    Auth,
    Application,
    Academy,
    Upload,
    Session,
    Qrcode,
    Package,
    Presence,
}
