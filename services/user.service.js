const db = require('../models');


const REGEXP_email = /^\S+@\S+\.\S+$/;
const REGEXP_name = /^[a-zA-Z]+$/;
const REGEXP_phone = /^(0|\+33)[-. ]?[1-9]{1}([-. ]?[0-9]{2}){4}$/;

// create
const createUser = async (mail, pwd, lastname, firstname, phone) => {

    if(mail === "" || typeof mail !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_email.test(mail)) throw new Error('invalid email');

    if(lastname === "" || typeof lastname !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_name.test(lastname)) throw new Error('invalid lastname');

    if(firstname === "" || typeof firstname !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_name.test(firstname)) throw new Error('invalid firstname');

    if(phone === "" || typeof phone !== "string") throw new Error('should be a string not empty');
    if(!REGEXP_phone.test(phone)) throw new Error('invalid phone');

    try {
        const User = await db.user.create({
            email: mail,
            password: pwd,
            nom: lastname,
            prenom: firstname,
            telephone: phone, 
        });
        console.log('User ${User.nom} ${User.prenom} has been successfully added')
    } catch (err) {
        console.log('Unable to connect to the database : ', err);
    }

}

module.exports = {
    createUser,
}