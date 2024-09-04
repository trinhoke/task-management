const express = require("express");
const router = express.Router();

const taskController = require("../../../controllers/task.controller");

router.get("/", taskController.index);

router.get("/detail/:id", taskController.detail);

router.post("/create", taskController.create);

router.patch("/update/:id", taskController.update);

router.delete("/delete/:id", taskController.delete);

router.patch("/update-status/:id", taskController.updateStatus);

router.patch("/update-multiple", taskController.updateMultiple);

module.exports = router;