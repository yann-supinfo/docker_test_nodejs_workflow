const db = require("../models");
const { Op } = require('sequelize');
exports.allHotels = async (req, res) => {
   // const hotels = await db.hotel.findAll();
    //res.json(hotels);

        try {
          const query = req.query.name;
          let hotels;
          console.log(query, typeof query)
          console.log(query != undefined)
          if (query != null && query != undefined && query.length != 0) {
            console.log('HERE')
            hotels = await db.hotel.findAll({
              where: {
                [Op.or]: [
                
                    {
                    name: {
                    [db.Sequelize.Op.like]: `%${query}%`,
                    }},
                    {
                    address: {
                    [db.Sequelize.Op.like]: `%${query}%`,
                    }}
                ],
              },
            });
          } else {
            hotels = await db.hotel.findAll();
          }
          res.json(hotels);
        } catch (err) {
          console.error(err);
          res.status(500).send('Erreur serveur');
        }
      
}

exports.findById = async (req, res) => {
    const id = parseInt(req.params.id);
    const hotel = await db.hotel.findByPk(id);
    res.json(hotel);
}