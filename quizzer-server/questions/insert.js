require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect(`${process.env.MONGO_URL}/Quizzer`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const models = require('../models/index');

/**
 * From promisewrappers.js
 */
const readFileP = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const getAllQuestions = async () => {
  let q;
  await readFileP(path.join(__dirname, 'vragen.json'))
    .then((data) => JSON.parse(data))
    .then((parsed) => (q = parsed))
    .catch((err) => console.log(err));
  return q;
};

const clearAndInsertQuestions = async () => {
  const q = await getAllQuestions();
  const { model } = models.question;

  try {
    await model.deleteMany({});
    await model.insertMany(q);
  } catch (e) {
    console.log(e);
  }

  console.log(`Inserted ${q.length} questions.`);
};

clearAndInsertQuestions().then(process.exit);
