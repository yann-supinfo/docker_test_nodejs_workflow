const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.use(require('chai-as-promised'));
const Reservation = require('../services/reservation.service');
const Hotel = require('../services/hotel.service');
const User = require('../services/user.service');
const db = require('../models');

describe('Reservation', () => {

    before((done) => {
        db.sequelize.sync({force: true})
            .then(() => {
                console.log('Base de données synchronisée avec succès.');
                done();
            })
            .catch((err) => {
                console.error('Erreur lors de la synchronisation de la base de données : ', err);
                done(err);
            })
    });

/**
 * CREATE RESERVATION TEST
 */

    describe('createReservation function', () => {

        describe("checkin validation", () => {
                
            it("should throw an error when checkin is null", async () => {
                await expect(Reservation.createReservation(null, new Date("2023-10-01"), 1, 1, 1)).to.be.rejectedWith("date is null");
            });
        
            it("should throw an error when checkin is not a date object", async () => {
                await expect(Reservation.createReservation("2023-09-10", new Date("2023-10-01"), 1, 1, 1)).to.be.rejectedWith("should be a date object");
            });

            it("should throw an error when checkin is a past date", async () => {
                await expect(Reservation.createReservation("2020-09-10", new Date("2023-10-01"), 1, 1, 1)).to.be.rejectedWith("can not be a past date");
            });
        
            it("should create a reservation when checkin is valid", async () => {
                const user = await expect(User.createUser("checkinValidation@mail.com", "Passw0rd!", "toto", "titi", "0600000000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du checkin", "12 rue du checkin, 14000 Caen", "0600000000", "description", "checkin@hotel.com", 50)).to.not.be.rejected;
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            });
        });
    });
});
//////////////////////////////////////////////////////:
//         describe("address validation", () => {
                
//             it("should throw an error when address is null", async () => {
//                 await expect(Hotel.createHotel("hotel du chat", null, "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("address is null");
//             });
        
//             it("should throw an error when address is more than 50 characters", async () => {
//                 await expect(Hotel.createHotel("hotel du chat", "a".repeat(51), "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("address is more than 50 characters");
//             });
        
//             it("should throw an error when name is empty or not a string", async () => {
//                 await expect(Hotel.createHotel("hotel du chat", "", "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du chat", [], "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du chat", {}, "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du chat", 12, "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//             });
        
//             it("should create an hotel when address is valid", async () => {
//                 await expect(Hotel.createHotel("hotel du chat", "12 rue du chat, 14000 Caen", "0222222222", "description", "chat@hotel.com", 50)).to.not.be.rejected;
//             });
//         });

//         describe("phone validation", () => {
                
//             it("should throw an error when phone is null", async () => {
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", null, "description", "chien@hotel.com", 50)).to.be.rejectedWith("phone is null");
//             });
        
//             it("should throw an error when phone is empty or not a string", async () => {
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "", "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", [], "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", {}, "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", 12, "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//             });
        
//             it("should throw an error when phone is not valid", async () => {
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "+33606060606345", "description", "chien@hotel.com", 50)).to.be.rejectedWith('invalid phone');
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "+33606", "description", "chien@hotel.com", 50)).to.be.rejectedWith('invalid phone');
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "+3360+454545", "description", "chien@hotel.com", 50)).to.be.rejectedWith('invalid phone');
//             });
        
//             it("should create an hotel when phone is valid", async () => {
//                 await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "0333333333", "description", "chien@hotel.com", 50)).to.not.be.rejected;
//             });
//         });

//         describe("email validation", () => {
                
//             it("should throw an error when email is null", async () => {
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", null, 50)).to.be.rejectedWith("email is null");
//             });
        
//             it("should throw an error when email is more than 50 characters", async () => {
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "r".repeat(51)+"at@hotel.com", 50)).to.be.rejectedWith("email is more than 50 characters");
//             });
        
//             it("should throw an error when email is empty or not a string", async () => {
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", [], 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", {}, 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", 12, 50)).to.be.rejectedWith("should be a string not empty");
//             });
        
//             it("should throw an error when email is not valid", async () => {
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rathotel.com", 50)).to.be.rejectedWith('invalid email');
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rat@hotel", 50)).to.be.rejectedWith('invalid email');
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rathotel", 50)).to.be.rejectedWith('invalid email');
//             });
        
//             it("should create an hotel when name is valid", async () => {
//                 await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rat@hotel.com", 50)).to.not.be.rejected;
//             });
//         });

//         describe("description validation", () => {
                
//             it("should throw an error when description is null", async () => {
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", null, "ver@hotel.com", 50)).to.be.rejectedWith("description is null");
//             });
        
//             it("should throw an error when description is more than 100 characters", async () => {
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", "d".repeat(101), "ver@hotel.com", 50)).to.be.rejectedWith("description is more than 100 characters");
//             });
        
//             it("should throw an error when description is empty or not a string", async () => {
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", "", "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", [], "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", {}, "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", 12, "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
//             });
        
//             it("should create an hotel when description is valid", async () => {
//                 await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", "description", "ver@hotel.com", 50)).to.not.be.rejected;
//             });
//         });

//         describe("price validation", () => {
                
//             it("should throw an error when price is null", async () => {
//                 await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", null)).to.be.rejectedWith("price is null");
//             });
        
//             it("should throw an error when price is not an integer", async () => {
//                 await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", "50")).to.be.rejectedWith("should be an integer");
//                 await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", [])).to.be.rejectedWith("should be an integer");
//                 await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", {})).to.be.rejectedWith("should be an integer");
//             });
        
//             it("should create an hotel when price is valid", async () => {
//                 await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", 50)).to.not.be.rejected;
//             });
//         });

//         describe("create Hotel validation", () => {
        
//             it("should throw an error when Hotel already exist", async () => {
//                 await expect(Hotel.createHotel("hotel du castor", "12 rue du castor, 14000 Caen", "0999988776", "description", "castor@hotel.com", 50)).to.not.be.rejected;
//                 await expect(Hotel.createHotel("hotel du lapin", "12 rue du lapin, 14000 Caen", "0119911987", "description", "castor@hotel.com", 50)).to.be.rejectedWith("Hotel email already exist");
//                 await expect(Hotel.createHotel("hotel du sac", "12 rue du sac, 14000 Caen", "0999988776", "description", "sac@hotel.com", 50)).to.be.rejectedWith("Hotel phone already exist");
//                 await expect(Hotel.createHotel("hotel du bras", "12 rue du castor, 14000 Caen", "0519911987", "description", "bras@hotel.com", 50)).to.be.rejectedWith("Hotel address already exist");
//             });
        
//         });

//     });

// });


