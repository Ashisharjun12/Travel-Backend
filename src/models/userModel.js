import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { _config } from "../config/config.js";
import { travelSchema } from "./traveModel.js";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: [true, "fullname is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password should be min 6 char"],
      select: false,
    },
    avatar: {
      id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    travellerDetails: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "travel",
      },
    ],
    tripsBuiltCount: {
      type: Number,
      default: 0,
    },
  },

  { timestamps: true }
);

//hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password.toString(), 10);
  next();
});

//validate password or compare password
userSchema.methods.isValidatedPassword = async function (usersendPassword) {
  return await bcrypt.compare(usersendPassword.toString(), this.password);
};

//access token
userSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id }, _config.ACCESS_TOKEN || "", {
    expiresIn: _config.ACCESS_TOKEN_EXPIRY,
  });
};

//refresh token
userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id }, _config.REFRESH_TOKEN || "", {
    expiresIn: _config.REFRESH_TOKEN_EXPIRY,
  });
};

const usermodel = new mongoose.model("user", userSchema);

export default usermodel;
