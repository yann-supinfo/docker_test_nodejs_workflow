const cors = require("cors");
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./models');

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// database

const Role = db.role;
// Create a new Sequelize instance
console.log(process.env.DB_USER, process.env.DB_PASSWORD)
db.sequelize.sync({force:true})
  .then(() => {
    initial();
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
// Test the connection
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// Define the route
/*app.get('/', async (req, res) => {
    const chambres = await db.chambre.findAll({
        include: [db.hotel]
      });


  
      const json = JSON.stringify(chambres, null, 2); // Indentation de 2 espaces pour une meilleure lisibilité
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Length', Buffer.byteLength(json));
      res.setHeader('Access-Control-Allow-Origin', '*'); // Permettre l'accès à partir de n'importe quel domaine
      res.send(json);
  // Get all hotels

});
*/
// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

function initial() {
  db.role.create({
    id: 1,
    name: "user"
  });
 
  db.role.create({
    id: 2,
    name: "moderator"
  });
 
  db.role.create({
    id: 3,
    name: "admin"
  });      
  console.log('///////////////////////////////////////// CALLED ////////////////////////////')

}