const mongoose = require("mongoose");

const blacklistSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [true, "Token is required"]
    }
}, {
    timestamps: true
});

const blacklistModel = mongoose.model("blacklistToken", blacklistSchema);

module.exports = blacklistModel;
