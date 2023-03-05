module.exports = (sequelize, Sequelize) => {
  const Reservation = sequelize.define('reservation', {
    checkin: Sequelize.DATE,
    checkout: Sequelize.DATE,
    numberPeople: Sequelize.INTEGER,
    price: Sequelize.INTEGER,
  });
  
  
  return Reservation;
  };