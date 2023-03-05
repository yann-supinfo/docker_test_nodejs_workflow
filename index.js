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
  res.json({ message: "Welcome to hotel application." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/hotel.routes')(app);

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
  
  const hotels = [
    {
      name: 'Grand Hotel Central',
      address: '123 rue des hôtels',
      description: 'Cet hôtel est situé dans le centre-ville',
      phone: '01 23 45 67 89',
      email: 'hotel-a@example.com',
    },
    {
      name: 'Le Meridien',
      address: '456 rue des hôtels',
      description: 'Cet hôtel est situé près de la plage',
      phone: '02 34 56 78 90',
      email: 'hotel-b@example.com',
    },
    {
      name: 'Hilton Garden Inn',
      address: '789 rue des hôtels',
      description: 'Cet hôtel est situé à la campagne',
      phone: '03 45 67 89 01',
      email: 'hotel-c@example.com',
    },
    {
      name: 'Hotel Renaissance',
      address: '1011 rue des hôtels',
      description: 'Cet hôtel est situé en montagne',
      phone: '04 56 78 90 12',
      email: 'hotel-d@example.com',
    },
    {
      name: 'The Plaza',
      address: '1213 rue des hôtels',
      description: 'Cet hôtel est situé dans un quartier animé',
      phone: '05 67 89 01 23',
      email: 'hotel-e@example.com',
    }
  ];
  
  // Ajouter les hôtels à la base de données
  db.hotel.bulkCreate(hotels)
    .then(() => {
      console.log('Les hôtels ont été créés avec succès');
    })
    .catch((error) => {
      console.error('Une erreur est survenue lors de la création des hôtels :', error);
    });

  console.log('///////////////////////////////////////// CALLED ////////////////////////////')

}