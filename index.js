require('dotenv').config()
const express = require('express');
const app = express();



app.get('/', (req, res) => {
  res.send('<h1 style="width:200px;height:200px;background-color:blue;">New Title</h1>');
});

app.listen(process.env.PORT, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);