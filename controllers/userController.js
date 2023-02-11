const Models = require("../models");
const factoryHandler = require("./factoryHandler");
const cloudinary = require("../utils/cloudinary");
const AppError = require("../utils/appError");
const { StatusCodes } = require("http-status-codes");

exports.getAllUsers = factoryHandler.getAll(Models.User);

exports.getUser = factoryHandler.getOne(Models.User);

exports.createUser = factoryHandler.createOne(Models.User);

exports.updateUser = factoryHandler.updateOne(Models.User);

exports.deleteUser = factoryHandler.deleteOne(Models.User);

exports.searchUser = factoryHandler.search(Models.User);

exports.getMeMiddleware = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.getMe = factoryHandler.getOne(Models.User, true);

exports.updateMeMiddleware = async (req, res, next) => {
  const { name, email } = req.body;

  req.params.id = req.user._id;
  req.body = {
    name: name ?? undefined,
    email: email ?? undefined,
  };
  next();
};

exports.updateMe = factoryHandler.updateOne(Models.User, true);

exports.deleteMeMiddleware = (req, res, next) => {
  req.params.id = req.user._id;
  next();
};

exports.deleteMe = factoryHandler.deleteOne(Models.User);

exports.updateMyPhotoMiddleware = async (req, res, next) => {
  const { public_id: publicId } = req.body;
  req.params.id = req.user._id;

  try {
    const data = await cloudinary.api.resource(publicId, {
      resource_type: "image",
    });

    req.body = {
      photo: data.public_id,
    };

    next();
  } catch (error) {
    return next(new AppError("Invalid public id."));
  }
};

exports.updateMyPhoto = factoryHandler.updateOne(Models.User, true);
