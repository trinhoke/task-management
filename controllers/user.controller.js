const Task = require("../models/task.model");
const User = require("../models/user.model");
const ForgotPassword = require("../models/forgot-password");

const searchHelper = require("../helpers/search");
const paginationHelper = require("../helpers/pagination");
const sortHelper = require("../helpers/sort");
const generateHelper = require("../helpers/generate");
const sendMailHelper = require("../helpers/send-mail");

const bcrypt = require("bcrypt");

// [POST] /api/v1/user/register
module.exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
       
        const user = await User.findOne({ email: email });  
        if (user) {
            return res.status(400).json({
                code: 400,
                message: "Email already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
        });

        const token = newUser.token;
        res.cookie("token", token); 

        res.json({
            code: 200,
            message: "Register successfully",
            token: token,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// [POST] /api/v1/user/login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(400).json({
                code: 400,
                message: "Email or password is incorrect"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({
                code: 400,
                message: "Email or password is incorrect"
            });
        }

        const token = user.token;
        res.cookie("token", token); 

        res.json({
            code: 200,
            message: "Login successfully",
            token: token,
        }); 

    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
}

// [GET] /api/v1/user/logout
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.json({
            code: 200,
            message: "Logout successfully",
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
}   

// [POST] /api/v1/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(400).json({
                code: 400,
                message: "Email is incorrect",
            });
        }

        const otp = generateHelper.generateOtp();

        const html = `
            <h1>Your OTP code is ${otp}</h1>
        `;

        sendMailHelper.sendMail(email, "Forgot Password", html);

        const forgotPassword = await ForgotPassword.create({
            email: email,
            otp: otp,
        });
       
        res.json({
            code: 200,
            message: "Sent otp successfully",
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
}

// [POST] /api/v1/user/password/otp
module.exports.otp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const forgotPassword = await ForgotPassword.findOne({ email: email, otp: otp });
        if(!forgotPassword) {
            return res.status(400).json({
                code: 400,
                message: "OTP is incorrect",
            });
        }

        const user = await User.findOne({ email: email });
        const token = user.token;
        res.cookie("token", token);

        res.json({
            code: 200,
            message: "OTP is correct",
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
}

// [POST] /api/v1/user/password/reset
module.exports.resetPassword = async (req, res) => {
    try {
        const {password} = req.body;
        const token = req.cookies.token;
        const user = await User.findOne({ token: token });
        if(!user) {
            return res.status(400).json({
                code: 400,
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.updateOne({ _id: user._id }, {
            $set: { 
                password: hashedPassword,
            } 
        });

        res.json({
            code: 200,
            message: "Reset password successfully",
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Internal server error",
            error: error.message 
        });
    }    
}

