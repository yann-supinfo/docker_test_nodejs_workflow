const { Sequelize, DataTypes } = require('sequelize');
const db = require('./');



 db.sequelize.sync({force:true})
  .then(() => {
    initial();
    console.log("Synced db.");
    
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });


async function initial() {
    await db.role.create({
      id: 1,
      name: "user"
    });
   
    await db.role.create({
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
    await db.hotel.bulkCreate(hotels)
      .then(() => {
        console.log('Les hôtels ont été créés avec succès');
      })
      .catch((error) => {
        console.error('Une erreur est survenue lors de la création des hôtels :', error);
      });
      process.exit(0);
    console.log('///////////////////////////////////////// CALLED ////////////////////////////')
  
  }