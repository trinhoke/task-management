
module.exports.register = (req, res, next) => {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
        return res.status(400).json({
            code: 400,
            message: "All fields are required"
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            code: 400,
            message: "Password and confirm password do not match"
        });
    }
    
    next();
}

module.exports.login = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            code: 400,
            message: "All fields are required"
        });
    }   
    next();
}

module.exports.resetPassword = (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return res.status(400).json({
            code: 400,
            message: "All fields are required"
        });
    }
    
    if (password !== confirmPassword) {
        return res.status(400).json({
            code: 400,
            message: "Password and confirm password do not match"
        });
    }
    
    next();
};