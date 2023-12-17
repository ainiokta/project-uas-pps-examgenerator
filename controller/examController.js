const connection = require("../config/config.js");

//create exam
async function getQuestionsFromDatabase(topic, difficulty_lvl) {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT question FROM questions WHERE topic = ? AND difficulty_lvl = ?",
      [topic, difficulty_lvl],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results[0]);
        }
      }
    );
  });
}
async function createExamWithTopicCriteria(
  examData,
  topicCriteriaData
) {
  try {
    // Insert exam details with parameterized query
    const questCriterion = examData.quest_criterion
      ? JSON.stringify(examData.quest_criterion)
      : null;

    const allQuestionsData = await getQuestionsFromDatabase(
        examData.topic,
        examData.difficulty_lvl
        );

    const examQuestion =
      examData.exam_question !== undefined && examData.exam_question !== null
        ? JSON.stringify(examData.exam_question)
        : JSON.stringify([]);

    console.log("Exam Data:", examData);
    console.log("Quest criterion:", questCriterion);
    console.log("Exam question:", examQuestion);
    // Insert exam details with parameterized query
    const examResult = connection.query(
      "INSERT INTO exams (exam_name, course_id, exam_date, duration, num_of_quest, quest_criterion, exam_question) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        examData.exam_name,
        examData.course_id,
        examData.exam_date,
        examData.duration,
        examData.num_of_quest,
        questCriterion,
        examQuestion,
      ]
    );

    const examId = examResult.insertId;

    // Validate that the total topic percentages sum to 100%
    const totalTopicPercentage = topicCriteriaData.reduce((sum, topic) => {
      console.log(`Topic: ${topic.topic}, Percentage: ${topic.percentage}`);
      return sum + topic.percentage;
    }, 0);

    if (totalTopicPercentage !== 100) {
      throw new Error("Total topic percentages must sum to 100%.");
    }

    // Initialize an array to store selected questions
    const selectedQuestions = [];

    // Loop through each topic criterion
    for (const topicCriteria of topicCriteriaData) {
      // Filter questions for the current topic
      const topicQuestions = Array.isArray(allQuestionsData)
        ? allQuestionsData.filter((q) => q.topic === topicCriteria.topic)
        : [];

      // Calculate the number of questions for each difficulty level based on the specified percentages
      const numQuestions = Math.round(
        (topicCriteria.percentage / 100) * examData.num_of_quest
      );
      const numCriteria1 = Math.round(
        numQuestions * (topicCriteria.difficulty1 / 100)
      );
      const numCriteria2 = Math.round(
        numQuestions * (topicCriteria.difficulty2 / 100)
      );
      const numCriteria3 = Math.round(
        numQuestions * (topicCriteria.difficulty3 / 100)
      );
      const numCriteria4 = Math.round(
        numQuestions * (topicCriteria.difficulty4 / 100)
      );
      const numCriteria5 =
        numQuestions -
        numCriteria1 -
        numCriteria2 -
        numCriteria3 -
        numCriteria4;

      // Validate that there are enough questions for each criterion
      if (
        topicQuestions.length < numCriteria1 ||
        topicQuestions.length < numCriteria2 ||
        topicQuestions.length < numCriteria3
      ) {
        throw new Error(
          `Insufficient questions for the specified criteria for topic ${topicCriteria.topic}.`
        );
      }

      // Randomly select questions for each difficulty level within the topic
      selectedQuestions.push(
        ...getRandomSubset(
          topicQuestions.filter((q) => q.difficulty_level === 1),
          numCriteria1
        ),
        ...getRandomSubset(
          topicQuestions.filter((q) => q.difficulty_level === 2),
          numCriteria2
        ),
        ...getRandomSubset(
          topicQuestions.filter((q) => q.difficulty_level === 3),
          numCriteria3
        ),
        ...getRandomSubset(
          topicQuestions.filter((q) => q.difficulty_level === 4),
          numCriteria4
        ),
        ...getRandomSubset(
          topicQuestions.filter((q) => q.difficulty_level === 5),
          numCriteria5
        )
      );
    }

    // Update the exam_questions field with the selected questions
    await connection.query(
      "UPDATE exams SET exam_question = ? WHERE examId = ?",
      [JSON.stringify(selectedQuestions), examId]
    );
    
    console.log("Exam created successfully!");
  } catch (error) {
    console.error("Error creating exam:", error);
  }
}

// Helper function to get a random subset of questions
function getRandomSubset(array, numItems) {
  const shuffled = array.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numItems);
}

//get exam list
const getAllExam = (req, res) =>{
    const getqstnbankquery = "SELECT * FROM exams";
  connection.query(getqstnbankquery, (err, results) => {
    if (err) {
      res.status(500).json({ message: "Gagal memuat bank soal" });
    } else {
      res.json(results);
    }
  });
}

module.exports = {
  createExamWithTopicCriteria,
  getAllExam
};
