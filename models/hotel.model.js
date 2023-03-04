module.exports = (sequelize, Sequelize) => {

const Hotel = sequelize.define('hotel', {
    name: Sequelize.STRING,
    address: Sequelize.STRING,
    phone: Sequelize.STRING,
    description: Sequelize.STRING,
    email: Sequelize.STRING,
    price: Sequelize.INTEGER,
  });
  

  return Hotel;
};