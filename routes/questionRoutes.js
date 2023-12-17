const express = require("express");
const questionController = require("../controller/questionController.js");
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post("/question_bank", questionController.createQuestion);
router.get("/question_bank", questionController.getquestionbank);
router.get("/question_bank/:id_quest", questionController.getquestionId);
router.delete("/question_bank/:id_quest", questionController.deleteqstnId);
router.patch("/question_bank/:id_quest", questionController.updateqstnId);
router.post('/question_bank/upload', upload.single('file'), async (req, res) => {
    try {
        await questionController.parseAndSaveToDatabase(req.file.buffer);
        res.status(200).json({ message: 'File uploaded and data saved to the database.' });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;