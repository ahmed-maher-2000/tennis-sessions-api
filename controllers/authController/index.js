const catchAsync = require("../../utils/catchAsync");
const Models = require("../../models");
const AppError = require("../../utils/appError");
const Token = require("./Token");
const statusCodes = require("http-status-codes");
const Sender = require("../../utils/Sender");
const Email = require("../../utils/email");
const crypto = require("crypto");

exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  let user = await Models.User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  Token.sendUser(res, statusCodes.CREATED, user);
});

exports.login = catchAsync(async (req, res, next) => {
  const { password, email } = req.body;

  if (!email || !password)
    return next(
      new AppError("Please, provide email or password", statusCodes.BAD_REQUEST)
    );

  const user = await Models.User.findOne({
    email,
  }).select("+password +email");

  if (!user || !(await user.correctPassword(user.password, password)))
    return next(
      new AppError("Incorrect email or password.", statusCodes.BAD_REQUEST)
    );

  Token.sendUser(res, statusCodes.OK, user);
});

exports.logout = catchAsync((req, res, next) => {
  Sender.send(res.clearCookie("jwt"), statusCodes.OK, undefined, {
    message: "You logged out successfully.",
  });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await Models.User.findOne({ email }).select("+email");
  if (!user)
    return next(
      new AppError("There is no user with this email.", statusCodes.BAD_REQUEST)
    );
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const URL = `http://${req.hostname}/reset-password?token=${resetToken}`;
    await new Email(user, URL).sendPasswordReset();

    Sender.send(res, statusCodes.OK, undefined, {
      message: "Token is sent to your email.",
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(error);
    return next(
      new AppError(
        "There was an error sending the email. Try again later",
        statusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, passwordConfirm } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await Models.User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user)
    return next(
      new AppError("Token is invalid or has expired", statusCodes.BAD_REQUEST)
    );

  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  Token.sendUser(res, statusCodes.OK, user);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { password, newPassword, newPasswordConfirm } = req.body;
  const user = await Models.User.findById(req.user._id).select("+password");
  const isPasswordCorrect = await user.correctPassword(user.password, password);

  if (!isPasswordCorrect)
    return next(
      new AppError("The old password is incorrect.", statusCodes.BAD_REQUEST)
    );

  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;

  await user.save();

  Token.sendUser(res, statusCodes.OK, user);
});
