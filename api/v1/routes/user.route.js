const express = require("express");
const router = express.Router();

const userController = require("../../../controllers/user.controller");

const userValidate = require("../../../validates/user.validate");

const {authenticate} = require("../../../middleware/authenticate.middleware");

router.post("/register",
    userValidate.register,
    userController.register
);

router.post("/login",
    userValidate.login,
    userController.login    
);    

router.get("/logout",
    userController.logout
);

router.post("/password/forgot",
    userController.forgotPassword
);

router.post("/password/otp",
    userController.otp
);
    
router.post("/password/reset",
    userValidate.resetPassword,
    authenticate,
    userController.resetPassword
);

router.get("/profile",
    authenticate,
    userController.profile
);

module.exports = router;