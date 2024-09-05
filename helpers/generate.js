const crypto = require('crypto');

module.exports.generateToken = () => {
    return crypto.randomBytes(32).toString("hex");
}   

module.exports.generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000);
}
