const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./models');

const app = express();

// Create a new Sequelize instance
console.log(process.env.DB_USER, process.env.DB_PASSWORD)
db.sequelize.sync()
  .then(() => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });
// Test the connection

// Define the route
app.get('/', async (req, res) => {
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

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});