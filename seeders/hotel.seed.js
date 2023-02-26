
module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Create hotels
      console.log(queryInterface)
      const hotels = await queryInterface.bulkInsert('hotels', [
        {
          name: 'Hilton Hotel',
          address: '123 Main St',
          phone: '555-1234',
          email: 'info@hilton.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Marriott Hotel',
          address: '456 Elm St',
          phone: '555-5678',
          email: 'info@marriott.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
      console.log('ici', hotels)
      // Create rooms for Hilton Hotel
      await queryInterface.bulkInsert('chambres', [
        {
          numero: '101',
          type: 'Single',
          prix: 100,
          hotelId: hotels[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          numero: '102',
          type: 'Double',
          prix: 150,
          hotelId: hotels[0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
  
      // Create rooms for Marriott Hotel
      await queryInterface.bulkInsert('chambres', [
        {
          numero: '201',
          type: 'Single',
          prix: 120,
          hotelId: hotels[1],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          numero: '202',
          type: 'Double',
          prix: 180,
          hotelId: hotels[1],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    },
  
    down: async (queryInterface, Sequelize) => {
      // Remove the rooms and hotels from the database
      await queryInterface.bulkDelete('chambres', null, {});
      await queryInterface.bulkDelete('hotels', null, {});
    }
  };