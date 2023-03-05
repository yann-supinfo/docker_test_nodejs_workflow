const db = require('../models');
const { Sequelize } = require('sequelize');
const bcrypt = require("bcryptjs");

// for debugging only
const colors = require('colors');

const REGEXP_email = /^\S+@\S+\.\S+$/;
const REGEXP_name = /^[a-zA-Z]+$/;
const REGEXP_phone = /^(0|\+33)[-. ]?[1-9]{1}([-. ]?[0-9]{2}){4}$/;

/* C.R.U.D Function User */

    /* Create */
const createUser = async (mail, pwd, lastname, firstname, phone) => {

    try {

        isValidEmail(mail);
        isValidLastname(lastname);
        isValidFirstname(firstname);
        isValidPhone(phone);
        isValidPassword(pwd);

        phone = formatPhoneNumber(phone);
        let encryptedPassword = bcrypt.hashSync(pwd, 8);

        await isExistUserTable();
        if (await isExistUserEmail(0, mail)) throw new Error('email already exist'.red);
        if (await isExistUserPhone(0, phone)) throw new Error('phone already exist'.red);

        const User = await db.user.create({
            email: mail,
            password: encryptedPassword,
            nom: lastname,
            prenom: firstname,
            telephone: phone, 
        });
        console.log(`User ${User.nom} ${User.prenom} has been successfully added`.green);
        return User
    } catch (err) {
        throw err.message;
    }

}

    /* Read */
        /* By Id */
const findById = async (id) => {
    
    try {
        isValidId(id);
        await isExistUserTable();

        if(!await isExistUserId(id)) throw new Error('user Id does not exist'.red);

        const userSelected = await db.user.findByPk(id);
        console.log('debug : ', userSelected);
        if(userSelected === null) throw new Error('user Id does not exist'.red);

        console.log(`Utilisateur trouvé: ${userSelected.nom} ${userSelected.prenom}`.green);
        return userSelected;
                
    } catch(err) {
        throw err.message;
    }
}

        /* By Email */
const findByEmail = async (mail) => {

    try {
        isValidEmail(mail);
        await isExistUserTable();
        if (!await isExistUserEmail(0, mail)) throw new Error('User email does not exist'.red);

        const userSelected = await db.user.findOne({where: {email: mail} });
        
        console.log(`Utilisateur trouvé: ${userSelected.nom} ${userSelected.prenom}`.green);
        return userSelected;
                
    } catch(err) {
        throw err.message;
    }
}

        /* By Phone number */
const findByPhone = async (phone) => {

    try {
        isValidPhone(phone);
        await isExistUserTable();
        if (!await isExistUserPhone(0, phone)) throw new Error('User phone does not exist'.red);

        phone = formatPhoneNumber(phone);

        const userSelected = await db.user.findOne({where: {telephone: phone} });
        
        console.log(`Utilisateur trouvé: ${userSelected.nom} ${userSelected.prenom}`.green);
        return userSelected;
                
    } catch(err) {
        throw err.message;
    }
}

        /* By Lastname */
const findByLastname = async (lastname) => {

    try {

        isValidLastname(lastname);
        await isExistUserTable();
        if (!await isExistUserLastname(lastname)) throw new Error('User lastname does not exist'.red);

        const userSelected = await db.user.findAll({where: {nom: lastname} });
        
        console.log(`Utilisateurs trouvés : ${userSelected[0].nom}`.green);
        return userSelected;
                
    } catch(err) {
        throw err.message;
    }
}

        /* By Firstname */
const findByFirstname = async (firstname) => {

    try {
        isValidFirstname(firstname);
        await isExistUserTable();
        if (!await isExistUserFirstname(firstname)) throw new Error('User firstname does not exist'.red);

        const userSelected = await db.user.findAll({where: {prenom: firstname} });
        
        console.log(`Utilisateurs trouvés : ${userSelected[0].prenom}`.green);
        return userSelected;
                
    } catch(err) {
        throw err.message;
    }
}

    /* Update */
const updateUser = async (id, userObj) => {

    try {
        isValidId(id);
        isObj(userObj);

        await isExistUserTable();    
        
        if (userObj.hasOwnProperty('email')) {
            isValidEmail(userObj.email);
            if (await isExistUserEmail(id, userObj.email)) throw new Error('email already exist'.red);
        }
        if (userObj.hasOwnProperty('prenom')) isValidFirstname(userObj.prenom);
        if (userObj.hasOwnProperty('nom')) isValidLastname(userObj.nom);
        if (userObj.hasOwnProperty('telephone')) {
            isValidPhone(userObj.telephone);
            if (await isExistUserPhone(id, userObj.telephone)) throw new Error('phone already exist'.red);
        }
        if (userObj.hasOwnProperty('password')) isValidPassword(userObj.password);

        if(!await isExistUserId(id)) throw new Error('user Id does not exist');
        const user = await findById(id);

        if (userObj.hasOwnProperty('email')) user.email = userObj.email;
        if (userObj.hasOwnProperty('prenom')) user.prenom = userObj.prenom;
        if (userObj.hasOwnProperty('nom')) user.nom = userObj.nom;
        if (userObj.hasOwnProperty('telephone')) user.telephone = userObj.telephone;
        if (userObj.hasOwnProperty('password')) {
            user.password = bcrypt.hashSync(userObj.password, 8);
        }

        await user.save();
        console.log(`User with ID ${id} updated successfully`.green);
    } catch(err) {
        throw err.message;
    }

}

    /* Delete */
const deleteUser = async (id) => {

    

    try {
        isValidId(id);
        await isExistUserTable();
        if(!await isExistUserId(id)) throw new Error('user Id does not exist'.red);

        db.user.destroy({
            where: { id: id }
        })
        console.log(`User with ID ${id} removed successfully`.green);
    } catch(err) {
        throw err.message;
    }
}

/* Additionnal Function */
const formatPhoneNumber = (number) => {
    const strippedPrefix = number.replace(/^\+33/, '0');
    const digitsOnly = strippedPrefix.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
        return digitsOnly;
    }
    return null;
}

const isExistUserFirstname = async (firstname) => {
    if (await db.user.count({ where: {prenom: firstname} }) > 0 ) return true;
    return false;
}

const isExistUserLastname = async (lastname) => {
    if (await db.user.count({ where: {nom: lastname} }) > 0 ) return true;
    return false;
}

const isExistUserId = async (id) => {
    if (await db.user.count({ where: {id: id} }) > 0) return true;
    return false;
}

const isExistUserPhone = async (id, phone) => {
    if (await db.user.count({ where: {telephone: phone, id: { [db.Sequelize.Op.ne]: id}} }) > 0 ) return true;
    return false;
}

const isExistUserEmail = async (id, email) => {
    if (await db.user.count({ where: {email: email, id: { [db.Sequelize.Op.ne]: id}} }) > 0) return true;
    return false;
}

const isExistUserTable = async () => {
    const queryInterface = db.sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();

    if(!tables.includes('users')) {
        throw new Error('users table does not exist'.red);
    }
    return true;
}

const isValidId = (id) => {
    if(id === null) throw new Error('id is null'.red);
    if(typeof id !== "number") throw new Error('should be an integer'.red);
    return true;
}

const isObj = (obj) => {
    if (typeof obj !== "object" && obj !== null) throw new Error('should be an object'.red);
}

const isValidEmail = (email) => {
    if(email === null) throw new Error('email is null'.red);
    if(email.length > 50) throw new Error('email is more than 50 characters'.red);
    if(email === "" || typeof email !== "string") throw new Error('should be a string not empty'.red);
    if(!REGEXP_email.test(email)) throw new Error('invalid email'.red);
}

const isValidLastname = (lastname) => {
    if(lastname === null) throw new Error('lastname is null'.red);
    if(lastname.length > 50) throw new Error('lastname is more than 50 characters'.red);
    if(lastname === "" || typeof lastname !== "string") throw new Error('should be a string not empty'.red);
    if(!REGEXP_name.test(lastname)) throw new Error('invalid lastname'.red);
};

const isValidFirstname = (firstname) => {
    if(firstname === null) throw new Error('firstname is null'.red);
    if(firstname.length > 50) throw new Error('firstname is more than 50 characters'.red);
    if(firstname === "" || typeof firstname !== "string") throw new Error('should be a string not empty'.red);
    if(!REGEXP_name.test(firstname)) throw new Error('invalid firstname'.red);
};

const isValidPhone = (phone) => {
    if(phone === null) throw new Error('phone is null'.red);
    if(phone === "" || typeof phone !== "string") throw new Error('should be a string not empty'.red);
    if(!REGEXP_phone.test(phone)) throw new Error('invalid phone'.red);
};

const isValidPassword = (password) => {
    if(password === null) throw new Error('password is null'.red);
    if(password === "" || typeof password !== "string") throw new Error('should be a string not empty'.red);
    if(password.length > 50) throw new Error('password is more than 50 characters'.red);
    if(password.length < 7) throw new Error('password is less than 7 characters'.red);
    isContainsLowercase(password);
    isContainsNumber(password);
    isContainsSpecialCharacter(password);
    isContainsUppercase(password);
};

const isContainsLowercase = (string) => {
    if(!/[a-z]/.test(string)) throw new Error('should contains a lowercase'.red);
}

const isContainsUppercase = (string) => {
    if(!/[A-Z]/.test(string)) throw new Error('should contains a uppercase'.red);
}

const isContainsNumber = (string) => {
    if(!/[0-9]/.test(string)) throw new Error('should contains a number'.red);
}

const isContainsSpecialCharacter = (string) => {
    if(!/[^a-zA-Z0-9]/.test(string)) throw new Error('should contains a special character'.red);
}

/* Exports */
module.exports = {
    createUser,
    findById,
    findByEmail,
    findByPhone,
    findByLastname,
    findByFirstname,
    updateUser,
    deleteUser
}