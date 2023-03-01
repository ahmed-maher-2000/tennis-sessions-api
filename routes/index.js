const User = require('./userRoutes')
const Auth = require('./authRoutes')
const Upload = require('./uploadRoutes')
const Session = require('./sessionRoutes')
const Qrcode = require('./qrcodeRoutes')
const Application = require('./applicationRoutes')
const Academy = require('./academyRoutes')
const Payment = require('./paymentRoutes')
const Presence = require('./presenceRoutes')
const Package = require('./packageRoutes')
const Score = require('./scoreRoutes')

module.exports = {
    User,
    Auth,
    Application,
    Academy,
    Upload,
    Session,
    Qrcode,
    Payment,
    Package,
    Presence,
    Score,
}
