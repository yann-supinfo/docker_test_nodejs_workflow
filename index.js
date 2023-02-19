require('dotenv').config()
const express = require('express');
const app = express();
const Sequelize = require('sequelize');

console.log('DEBUG', process.env.DB_NAME, process.env.DB_USER)
function sleepSync(milliseconds) {
  const start = new Date().getTime();
  while (new Date().getTime() - start < milliseconds) {
    // attendre
  }
}

sleepSync(10000)
const sequelize = new Sequelize(
  'database',
  'database',
  'database',
  {
    port: 3306,
    host: '172.18.0.1',
    dialect: 'mysql'
  }
);



sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

app.get('/', (req, res) => {
  res.send('<h1 style="width:200px;height:200px;background-color:blue;">New Title</h1>');
});

app.listen(5000, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);