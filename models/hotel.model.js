module.exports = (sequelize, Sequelize) => {

const Hotel = sequelize.define('hotel', {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    phone: Sequelize.STRING,
    email: Sequelize.STRING,
  });
  

  return Hotel;
};