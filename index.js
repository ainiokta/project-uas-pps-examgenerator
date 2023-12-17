// index.js
const express = require("express");
const bodyParser = require("body-parser");
const connection = require("./config/config.js");
const dosenrouter = require("./routes/dosenRoutes.js");
const mhsrouter = require("./routes/mhsRoutes.js");
const courserouter = require("./routes/courseRoutes.js");
const questionrouter = require("./routes/questionRoutes.js");
const examrouter = require("./routes/examRoutes.js");

const app = express();
const port = 3300;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); // Add this line for URL-encoded data

app.use(dosenrouter);
app.use(mhsrouter);
app.use(courserouter);
app.use(questionrouter);
app.use(examrouter);

app.use((req, res, next) => {
    req.connection = connection;
    next();
});
app.listen(port, () => {
    console.log('Server is running...');
});