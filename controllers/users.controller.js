const User = require("../models/user.model");

module.exports.userList = async (req, res) => {
    try {
        const users = await User.find({}).select("fullName email");
        res.status(200).json({
            code: 200,
            message: "User list",
            users: users
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            message: error.message
        });
    }
};