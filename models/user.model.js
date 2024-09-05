const mongoose = require("mongoose");

const generate = require("../helpers/generate");

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        default: generate.generateToken(),
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema, "users");