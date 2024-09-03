const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "initial",
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema, "tasks");