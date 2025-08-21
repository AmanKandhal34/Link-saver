const mongoose = require("mongoose");

const LinkSchema = new mongoose.Schema({
    url: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

module.exports = mongoose.model("Link", LinkSchema);