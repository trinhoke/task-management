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
        const token = generateHelper.generateToken();

        const newUser = await User.create({
            fullName: fullName,
            email: email,
            password: hashedPassword,
            token: token,   
        });

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

        let token = user.token;
        if (!token) {
            token = generateHelper.generateToken();
            await User.updateOne({ _id: user._id }, { $set: { token: token } });
        }

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
        const user = req.user;

        const hashedPassword = await bcrypt.hash(password, 10);
        const newToken = generateHelper.generateToken(); 

        await User.updateOne({ _id: user._id }, {
            $set: { 
                password: hashedPassword,
                token: newToken, 
            } 
        });

        res.json({
            code: 200,
            message: "Đặt lại mật khẩu thành công",
            token: newToken, 
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Lỗi máy chủ nội bộ",
            error: error.message 
        });
    }    
}

// [GET] /api/v1/user/profile
module.exports.profile = async (req, res) => {
    try {
        res.json({
            code: 200,
            message: "Get profile successfully",
            data: req.user,
        });
    } catch (error) {
        res.status(500).json({ 
            code: 500,
            message: "Internal server error",
            error: error.message 
        });
    }
}
