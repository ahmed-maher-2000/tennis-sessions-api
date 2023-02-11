const { Schema, model, Types } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new Schema(
  {
    name: {
      type: String,
      require: [true, "Please, provide your name."],
      minLength: [5, "Name must be more than 5 characters"],
      maxLength: [60, "Name must be less than 60 characters"],
      trim: true,
    },

    email: {
      type: String,
      require: [true, "Please, provide your email."],
      validate: [validator.isEmail, "Please, provide a valid email."],
      minLength: [10, "Email must be more than 5 characters"],
      maxLength: [60, "Email must be less than 60 characters"],
      trim: true,
      unique: true,
      select: false,
    },

    password: {
      type: String,
      minLength: [8, "Password must be more than 8 characters"],
      select: false,
    },

    passwordConfirm: {
      type: String,
      require: [true, "Please, confirm your password"],
      validate: {
        validator: function (passConfirm) {
          return this.password === passConfirm;
        },
        message: "Passwords are not the same.",
      },
      select: false,
    },

    role: {
      type: String,
      trim: true,
      lower: true,
      enum: ["player", "trainer", "manager", "admin"],
      default: "player",
    },

    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },

    photo: {
      type: String,
      default: "/img/users/default.jpg",
    },

    sessions: {
      type: Number,
      default: 0,
    },

    passwordChangedAt: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.index({
  name: "text",
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({
    isActive: { $ne: false },
  });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(userPassword, candidatePassword);
};

userSchema.methods.isPasswordChangedAfter = function (iat) {
  return this.passwordChangedAt
    ? parseInt(new Date(this.passwordChangedAt).getTime() / 1000, 10) > iat
    : false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const tenMINS = 10 * 60 * 1000;
  this.passwordResetExpires = new Date(Date.now() + tenMINS); // 10 mins
  return resetToken;
};

module.exports = model("User", userSchema);
