const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userId:{type:String},
    email: {
      type: String,
      unique: true,
      lowercase: true,
    },
    password: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    phone: { type: String },
    token: { type: String },
    country_code: { type: String, default: "+91" },
    role: { type: String },
    profile_picture: { type: String },
    social_login: { type: Boolean, default: false },
    is_blocked: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const customer = mongoose.model("users", userSchema);
module.exports = customer;
