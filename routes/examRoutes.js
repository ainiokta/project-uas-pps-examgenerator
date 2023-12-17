const express = require("express");
const examController = require("../controller/examController.js");
const router = express.Router();

router.post("/exam", async (req, res) => {
  try {
    const { examData, topicCriteriaData } = req.body;

    // Insert exam details, topic criteria, and questions
    await examController.createExamWithTopicCriteria(
      examData,
      topicCriteriaData
    );

    res
      .status(200)
      .json({ success: true, message: "Exam created successfully!" });
  } catch (error) {
    console.error("Error creating exam:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});
router.get("/exam", examController.getAllExam);

module.exports = router;
