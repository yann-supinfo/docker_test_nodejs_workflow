const db = require("../models");
const UserService = require('../services/user.service')
const bcrypt = require("bcryptjs");

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



async function checkMatchPassword(id, password) {
  try {
    console.log(password)
    const user = await db.user.findOne({
      where: {
          id: id 
      }
    });
    console.log(user)
    return  bcrypt.compareSync(
        password,
        user.password)
       // Retourner vrai si un utilisateur est trouvé, faux sinon
  } catch (err) {
    throw err;
  }
}

const verifPassword = async (id, password) => {
  try {
    
      if (!id || !password) {throw('Paramètre manquant.');}
 
      console.log(password)

      console.log('check1')
      if (! await checkMatchPassword(id, password)) { throw('Le password est incorrect.') } 
  } catch (e) {
    console.log('check2', e)
      throw(e)
  }
}



exports.userUpdatePassword = async (req, res) => {
  try {
  
    const id = parseInt(req.body.id);
    const userData = req.body.user

    await verifPassword(id, userData.oldPassword)
    const user = await UserService.updateUser(id, {password: userData.password})
    res.json(user);
    } catch (e) {
      res.status(400).send({ message: 'Identifiant incorrect.' });
  
    }
}



exports.userUpdateProfil = async (req, res) => {
  try {
  const id = parseInt(req.body.id);
  const userData = req.body.user
  const user =  await UserService.updateUser(id, userData)
  res.json(user);
  } catch (e) {
    res.status(user);
  }
}


exports.userDelete = async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await db.user.findByPk(id,  {attributes: ['nom', 'email', 'prenom', 'telephone', 'username']});
  res.json(user);
}