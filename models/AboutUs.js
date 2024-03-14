const mongoose = require("mongoose");
const aboutUsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const aboutUs = mongoose.model("aboutus", aboutUsSchema);
module.exports = aboutUs;
