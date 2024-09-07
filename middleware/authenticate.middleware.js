const User = require("../models/user.model");

module.exports.authenticate = async (req, res, next) => {
    try{
        const token = req.headers.authorization.split(" ")[1];
        if(!token) {
            return res.status(400).json({
                code: 400,
                message: "Token not found",
            });
        }
        const user = await User.findOne({ token: token }).select("-password");  
        if (!user) {
            return res.status(400).json({
                code: 400,
                message: "User not found",
            });
        }
        req.user = user;    
    } catch (error) {
        return res.status(500).json({
            code: 500,
            message: "Internal server error",
        });
    }
    next();
}