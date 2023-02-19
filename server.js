const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const { cloudinaryConfig } = require('./utils/cloudinary')
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
})
const socketController = require('./controllers/socketController')

// auth middleware for socket io
io.use(socketController.protect)

// connection event in socket io
io.on('connection', socketController.connectionHandler(io))

dotenv.config()

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION!!')
    console.log(err.name, err.message)
    process.exit(1)
})

const DB =
    process.env.NODE_ENV === 'production'
        ? process.env.DATABASE
        : process.env.DATABASE_LOCAL
mongoose.set('strictQuery', false)
mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Database connected Successfully...'))

cloudinaryConfig()

const PORT = process.env.PORT ?? 3000
server.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`))

process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION !!!!!!!!')
    console.log(err)
    server.close(() => {
        process.exit(1)
    })
})

process.on('SIGTERM', () => {
    console.log('SIGTERM RECEIVED, Shutting down gracefully')
    server.close(() => {
        console.log('Process Terminated')
    })
})
