const Models = require('../models')
const catchAsync = require('../utils/catchAsync')
const Sender = require('../services/Sender')
const factoryHandler = require('./factoryHandler')
const { StatusCodes } = require('http-status-codes')

exports.getAllScores = factoryHandler.getAll(Models.Score)

exports.getScore = factoryHandler.getOne(Models.Score)

exports.createScoreMiddleware = (req, res, next) => {
    const { _id: userId } = req.user
    req.body.createdBy = userId
    next()
}
exports.createScore = factoryHandler.createOne(Models.Score)

exports.updateScoreMiddleware = (req, res, next) => {
    const { _id: userId } = req.user
    req.filterOptions = { createdBy: userId }
    next()
}
exports.updateScore = factoryHandler.updateOne(Models.Score)

exports.deleteScore = factoryHandler.deleteOne(Models.Score)

exports.getBestFivePlayers = catchAsync(async (req, res, next) => {
    const today = new Date(Date.now())
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)

    let documents = await Models.Score.aggregate([
        {
            // select All scores from first day in this month untill now
            $match: {
                createdAt: {
                    $gte: firstDay,
                    $lte: today,
                },
            },
        },
        {
            // group by player and sum their points
            $group: {
                _id: '$player',
                totalPoints: {
                    $sum: '$points',
                },
            },
        },
        {
            // project the _id key to player
            $project: {
                _id: 0,
                player: '$_id',
                totalPoints: 1,
            },
        },
        {
            // sort desc by totalPoints
            $sort: {
                totalPoints: -1,
            },
        },
        {
            // select 5 docs
            $limit: 5,
        },
    ])

    await Models.User.populate(documents, {
        path: 'player',
        select: {
            name: 1,
            photo: 1,
            role: 1,
        },
    })
    Sender.send(res, StatusCodes.OK, documents, {
        documents: documents.length,
    })
})
