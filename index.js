require('dotenv').config()
const express = require('express');
const app = express();
const Sequelize = require('sequelize');

console.log('DEBUG', process.env.DB_NAME, process.env.DB_USER)
await new Promise(resolve => setTimeout(resolve, 5000));
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: 6000,
    host: '127.0.0.1',
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

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);