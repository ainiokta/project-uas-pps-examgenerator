const connection = require("../config/config.js");
const excel = require("exceljs");

const createQuestion = (req, res) => {
  const { question, choices, difficulty_lvl, topic, course_id } = req.body;

  // Ensure the required fields are present
  if (!question || !choices || !difficulty_lvl || !topic || !course_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Check if difficulty is a valid value
  const validDifficulties = ["1", "2", "3", "4", "5"];
  if (!validDifficulties.includes(difficulty_lvl)) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  // Insert the question
  const questionInsertQuery =
    "INSERT INTO questions (question, difficulty_lvl, topic, course_id) VALUES (?, ?, ?, ?)";
  const values = [question, difficulty_lvl, topic, course_id];

  connection.query(questionInsertQuery, values, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const questionId = results.insertId;

    // Insert choices with correct answer marked
    const choicesInsertQuery =
      "INSERT INTO choices (question_id, choice, is_correct) VALUES (?, ?, ?)";
    const choicesInsertPromises = choices.map((choice) => {
      return new Promise((resolve, reject) => {
        const choicesValues = [questionId, choice.choice, choice.is_correct];

        connection.query(choicesInsertQuery, choicesValues, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(choicesInsertPromises)
      .then(() => {
        res.status(201).json({
          id: questionId,
          question,
          choices,
          difficulty_lvl,
          topic,
          course_id,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
};

const getquestionbank = (req, res) => {
  const getqstnbankquery = "SELECT * FROM questions";
  connection.query(getqstnbankquery, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat bank soal" });
    } else {
      res.json(results);
    }
  });
};

const getquestionId = (req, res) => {
  const questionId = req.params.id_quest;

  // Validate the questionId parameter
  if (!questionId || isNaN(questionId)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  // Query to get the question and its choices by ID
  const getQuestionQuery =
    "SELECT questions.*, choices.choice, choices.is_correct FROM questions LEFT JOIN choices ON questions.id_quest = choices.question_id WHERE id_quest = ?";

  connection.query(getQuestionQuery, [questionId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Check if a question with the specified ID was found
    if (results.length === 0) {
      return res.status(404).json({ error: "Question not found" });
    }

    // Organize the results to group choices with the question
    const question = {
      id: results[0].id,
      content: results[0].question,
      difficulty: results[0].difficulty,
      topic: results[0].topic,
      course_id: results[0].course_id,
      choices: results
        .filter((row) => row.choice !== null)
        .map((row) => ({ choice: row.choice, is_correct: row.is_correct })),
    };

    res.status(200).json({ question });
  });
};

const deleteqstnId = (req, res) => {
  const questionId = parseInt(req.params.id_quest, 10);

  // Validate the questionId parameter
  if (isNaN(questionId)) {
    return res.status(400).json({ error: "Invalid question ID" });
  }

  // Delete related choices first
  const deleteChoicesQuery = "DELETE FROM choices WHERE question_id = ?";

  connection.query(deleteChoicesQuery, [questionId], (err) => {
    if (err) {
      console.error("Error deleting choices:", err);
      return res.status(500).json({ error: err.message });
    }

    // Now, delete the question
    const deleteQuestionQuery = "DELETE FROM questions WHERE id_quest = ?";

    connection.query(deleteQuestionQuery, [questionId], (err, result) => {
      if (err) {
        console.error("Error deleting question:", err);
        return res.status(500).json({ error: err.message });
      }

      // Check if a row was affected
      if (result.affectedRows > 0) {
        console.log(
          `Question ${questionId} and related choices deleted successfully`
        );
        res.status(200).json({
          message: "Question and related choices deleted successfully",
        });
      } else {
        res.status(404).json({ message: "Question not found" });
      }
    });
  });
};

const updateqstnId = async (req, res) => {
  const { id_quest } = req.params;
  const { question, choices, difficulty_lvl, topic, course_id } = req.body;

  // Check if difficulty is a valid value
  const validDifficulties = ["1", "2", "3", "4", "5"];
  if (
    difficulty_lvl !== undefined &&
    !validDifficulties.includes(difficulty_lvl)
  ) {
    return res.status(400).json({ error: "Invalid difficulty value" });
  }

  // Update the question
  const questionUpdateQuery =
    "UPDATE questions SET question = ?, difficulty_lvl = ?, topic = ?, course_id = ? WHERE id_quest = ?";
  const questionUpdateValues = [question, difficulty_lvl, topic, course_id, id_quest];

  connection.query(questionUpdateQuery, questionUpdateValues, (err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // Update choices
    const choicesUpdatePromises = choices.map((choice) => {
      return new Promise((resolve, reject) => {
        const choicesUpdateQuery =
          "UPDATE choices SET choice = ?, is_correct = ? WHERE question_id = ? AND choice = ?";
        const choicesUpdateValues = [
          choice.choice,
          choice.is_correct,
          choice.question_id,
          choice.choice,
        ];

        connection.query(choicesUpdateQuery, choicesUpdateValues, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });

    Promise.all(choicesUpdatePromises)
      .then(() => {
        res.status(200).json({
          id_quest,
          question,
          choices,
          difficulty_lvl,
          topic,
          course_id,
        });
      })
      .catch((error) => {
        res.status(500).json({ error: error.message });
      });
  });
};

//upload file soal
async function parseAndSaveToDatabase(fileBuffer) {
  const workbook = new excel.Workbook();
  await workbook.xlsx.load(fileBuffer);

  const worksheet = workbook.getWorksheet(1); // Assuming the data is in the first sheet

  const questionsData = [];

  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber !== 1) {
      const questionText = row.getCell(2).value;
      let choices;
      try {
        choices = JSON.parse(row.getCell(3).value.trim());
      } catch (error) {
        console.error(`Problematic JSON string: ${row.getCell(3).value}`);
        console.error(
          `Error parsing choices at row ${rowNumber}: ${error.message}`
        );
        choices = [];
      }
      const difficultyLevel = row.getCell(4).value;
      const topic = row.getCell(5).value;
      const courseName = row.getCell(6).value;

      questionsData.push({
        questionText,
        choices,
        difficultyLevel,
        topic,
        courseName,
      });
    }
  });

  // Process questionsData and save to the database
  for (const question of questionsData) {
    // Retrieve course_id based on courseName from the course table
    const courseId = await getCourseIdFromDatabase(question.courseName);

    // Insert data into the questions table and get the generated question_id
    const questionId = await insertQuestionIntoDatabase(question, courseId);

    // Insert data into the choices table using the obtained question_id
    await insertChoicesIntoDatabase(question.choices, questionId);
  }

}

function getCourseIdFromDatabase(courseName) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT id FROM course WHERE nama_crs = ?",
      [courseName],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0].id);
        }
      }
    );
  });
}

function insertQuestionIntoDatabase(question, courseId) {
  return new Promise((resolve, reject) => {
    connection.query(
      "INSERT INTO questions (question, difficulty_lvl, topic, course_id) VALUES (?, ?, ?, ?)",
      [
        question.questionText,
        question.difficultyLevel,
        question.topic,
        courseId,
      ],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results.insertId); // Return the generated question_id
        }
      }
    );
  });
}

function insertChoicesIntoDatabase(choices, questionId) {
  const choicesPromises = choices.map((choice) => {
    return new Promise((resolve, reject) => {
      connection.query(
        "INSERT INTO choices (choice, is_correct, question_id) VALUES (?, ?, ?)",
        [choice.choices, choice.isCorrect, questionId],
        (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });

  return Promise.all(choicesPromises);
}


module.exports = {
  createQuestion,
  getquestionbank,
  getquestionId,
  deleteqstnId,
  updateqstnId,
  parseAndSaveToDatabase,
};
