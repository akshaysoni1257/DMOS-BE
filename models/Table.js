const mongoose = require("mongoose");

const tableSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true,
    },
    qrCode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Table = mongoose.model("QrTable", tableSchema);
module.exports = Table;
