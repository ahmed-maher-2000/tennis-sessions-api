const catchAsync = require('../utils/catchAsync')
const appFeatures = require('../utils/appFeatures')
const AppError = require('../utils/appError')
const { StatusCodes } = require('http-status-codes')
const Sender = require('../utils/Sender')
const { singular } = require('pluralize')

exports.getAll = (Model) =>
    catchAsync(async (req, res, next) => {
        const isAdmin = req.user?.role === 'admin'
        const collectionName = Model.collection.collectionName
        const featuresBeforePagination = new appFeatures(
            Model.find(),
            req.query
        ).filter()
        const features = new appFeatures(Model.find(), req.query)
            .filter()
            .limitFields()
            .paginate()
            .sort()

        const documents = isAdmin
            ? await features.query.select('+email +phoneNumber')
            : await features.query.select('-role')
        const documentsCount = await Model.countDocuments(
            featuresBeforePagination.query
        )

        Sender.send(
            res,
            StatusCodes.OK,
            {
                [collectionName]: documents,
            },
            {
                documents: documents.length,
                allDocuments: documentsCount,
            }
        )
    })

exports.getOne = (Model, isMe = false) =>
    catchAsync(async (req, res, next) => {
        const id = req.params.id
        const isAdmin = req.user?.role === 'admin'
        const document =
            isAdmin || isMe
                ? await Model.findById(id).select('+email +phoneNumber')
                : await Model.findById(id).select('-role')
        const collectionName = singular(Model.collection.collectionName)
        if (!document)
            return next(
                new AppError(
                    `${collectionName} is not found`,
                    StatusCodes.NOT_FOUND
                )
            )
        Sender.send(res, StatusCodes.OK, {
            [collectionName]: document,
        })
    })

exports.createOne = (Model, populateOptions) =>
    catchAsync(async (req, res, next) => {
        let document = new Model(req.body)

        await document.save()
        if (populateOptions) {
            document = await document.populate(populateOptions)
        }

        const collectionName = singular(Model.collection.collectionName)
        if (document.password) document.password = undefined
        Sender.send(res, StatusCodes.CREATED, {
            [collectionName]: document,
        })
    })

exports.updateOne = (Model, isMe, populateOptions) =>
    catchAsync(async (req, res, next) => {
        const isAdmin = req.user.role === 'admin'
        req.filterOptions = {
            _id: req.params.id,
            ...req.filterOptions,
        }

        const document =
            isAdmin || isMe
                ? await Model.findOneAndUpdate(req.filterOptions, req.body, {
                      new: true,
                      runValidators: true,
                  }).select('+email +phoneNumber +contents.answer')
                : await Model.findOneAndUpdate(req.filterOptions, req.body, {
                      new: true,
                      runValidators: true,
                  })

        if (populateOptions) document = await document.populate(populateOptions)

        const collectionName = singular(
            Model.collection.collectionName.slice(0, -1)
        )
        if (!document)
            return next(
                new AppError(
                    `${collectionName} is not found`,
                    StatusCodes.NOT_FOUND
                )
            )

        Sender.send(res, StatusCodes.OK, {
            [collectionName]: document,
        })
    })

exports.deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
        req.filterOptions = {
            _id: req.params.id,
            ...req.filterOptions,
        }

        const document = await Model.findOneAndDelete(req.filterOptions)

        const collectionName = singular(Model.collection.collectionName)
        if (!document)
            return next(
                new AppError(
                    `${collectionName} is not found`,
                    StatusCodes.NOT_FOUND
                )
            )

        Sender.send(res, StatusCodes.NO_CONTENT)
    })

exports.search = (Model) =>
    catchAsync(async (req, res, next) => {
        const { s } = req.query
        const documents = await Model.find(
            {
                $text: {
                    $search: s,
                },
            },
            { score: { $meta: 'textScore' } }
        )
            .sort({ score: { $meta: 'textScore' } })
            .limit(10)
            .select('-score')
        const collectionName = Model.collection.collectionName

        Sender.send(
            res,
            StatusCodes.OK,
            {
                [collectionName]: documents,
            },
            {
                documents: documents.length,
            }
        )
    })
