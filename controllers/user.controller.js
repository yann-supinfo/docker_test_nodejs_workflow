const db = require("../models");

exports.allAccess = (req, res) => {
    res.status(200).send("Public Content.");
  };
  
  exports.userBoard = (req, res) => {
    res.status(200).send("User Content.");
  };
  
  exports.adminBoard = (req, res) => {
    res.status(200).send("Admin Content.");
  };
  
  exports.moderatorBoard = (req, res) => {
    res.status(200).send("Moderator Content.");
  };


exports.findById = async (req, res) => {
    const id = parseInt(req.params.id);
    const user = await db.user.findByPk(id,  {attributes: ['nom', 'email', 'prenom', 'telephone', 'username']});
    res.json(user);
}