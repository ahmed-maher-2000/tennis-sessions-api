const { StatusCodes } = require('http-status-codes')
const catchAsync = require('../utils/catchAsync')
const qrcodeGenerator = require('../utils/qrCodeGenerator')

exports.generateUser = catchAsync(async (req, res, next) => {
    const { _id, name } = req.user
    const qr = await qrcodeGenerator(JSON.stringify({ _id, name }))
    res.status(StatusCodes.OK).send(qr)
})
