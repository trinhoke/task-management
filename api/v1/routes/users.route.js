const express = require("express");
const router = express.Router();
const usersController = require("../../../controllers/users.controller");

router.get("/list-user", usersController.userList);

module.exports = router;
