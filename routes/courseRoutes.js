const express = require("express");
const courseController = require("../controller/courseController.js");
const router = express.Router();

router.post("/course", courseController.createCourse);
router.get("/course", courseController.getcourse);
router.get("/course/:id", courseController.getcourseId);
router.put("/course/:id", courseController.updatecrsId);
router.patch("/course/:id", courseController.patchcrsId);
router.delete("/course/:id", courseController.deletecrsId);

module.exports = router;