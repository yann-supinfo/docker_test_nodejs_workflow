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
                await expect(Reservation.createReservation(new Date("2020-09-10"), new Date("2023-10-01"), 1, 1, 1)).to.be.rejectedWith("can not be a past date");
            });
        
            it("should create a reservation when checkin is valid", async () => {
                const user = await expect(User.createUser("checkinValidation@mail.com", "Passw0rd!", "toto", "titi", "0600000000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du checkin", "12 rue du checkin, 14000 Caen", "0600000000", "description", "checkin@hotel.com", 50)).to.not.be.rejected;
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            });
        });

        describe("checkout validation", () => {
                
            it("should throw an error when checkout is null", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), null, 1, 1, 1)).to.be.rejectedWith("date is null");
            });
        
            it("should throw an error when checkout is not a date object", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), "2023-10-01", 1, 1, 1)).to.be.rejectedWith("should be a date object");
            });

            it("should throw an error when checkout is a past date", async () => {
                await expect(Reservation.createReservation(new Date("2020-09-10"), new Date("2020-10-01"), 1, 1, 1)).to.be.rejectedWith("can not be a past date");
            });

            it("should throw an error when checkout is before checkin", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-09-01"), 1, 1, 1)).to.be.rejectedWith("checkout must be after checkin");
            });
        
            it("should create a reservation when checkout is valid", async () => {
                const user = await expect(User.createUser("checkoutValidation@mail.com", "Passw0rd!", "toto", "titi", "0610000000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du checkout", "12 rue du checkout, 14000 Caen", "0610000000", "description", "checkout@hotel.com", 50)).to.not.be.rejected;
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            });
        });

        describe("numberPeople validation", () => {
                
            it("should throw an error if numberPeople is null", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), null, 1, 1)).to.be.rejectedWith('number of people is null');
            });
    
            it("should throw an error if numberPeople is not an integer", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), "1", 1, 1)).to.be.rejectedWith('should be an integer');
            });
        
            it("should create a reservation when numberPeople is valid", async () => {
                const user = await expect(User.createUser("numberPeopleValidation@mail.com", "Passw0rd!", "toto", "titi", "0611000000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du numberPeople", "12 rue du numberPeople, 14000 Caen", "0611000000", "description", "numberPeople@hotel.com", 50)).to.not.be.rejected;
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            });
        });

        describe("hotelId validation", () => {
                
            it("should throw an error if hotelId is null", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, null, 1)).to.be.rejectedWith('id is null');
            });
    
            it("should throw an error if hotelId is not an integer", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, "1", 1)).to.be.rejectedWith('should be an integer');
            });

            it("should throw an error if hotelId does not exist", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, 30000, 1)).to.be.rejectedWith('hotelId does not exist');
            });
        
            it("should create a reservation when hotelId is valid", async () => {
                const user = await expect(User.createUser("hotelIdValidation@mail.com", "Passw0rd!", "toto", "titi", "0611100000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du hotelId", "12 rue du hotelId, 14000 Caen", "0611100000", "description", "hotelId@hotel.com", 50)).to.not.be.rejected;
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            });
        });

        describe("userId validation", () => {
                
            it("should throw an error if userId is null", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, 1, null)).to.be.rejectedWith('id is null');
            });
    
            it("should throw an error if userId is not an integer", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, 1, "1")).to.be.rejectedWith('should be an integer');
            });

            it("should throw an error if userId does not exist", async () => {
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, 1, 30000)).to.be.rejectedWith('userId does not exist');
            });
        
            it("should create a reservation when userId is valid", async () => {
                const user = await expect(User.createUser("userIdValidation@mail.com", "Passw0rd!", "toto", "titi", "0611110000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du userId", "12 rue du userId, 14000 Caen", "0611110000", "description", "userId@hotel.com", 50)).to.not.be.rejected;
                await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            });
        });

        describe("price validation", () => {
        
            it("should create a reservation when the correct price", async () => {
                const user = await expect(User.createUser("priceValidation@mail.com", "Passw0rd!", "toto", "titi", "0611111000")).to.not.be.rejected;
                const hotel = await expect(Hotel.createHotel("hotel du price", "12 rue du price, 14000 Caen", "0611111000", "description", "price@hotel.com", 50)).to.not.be.rejected;
                const reservation = await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
                expect(reservation.price).to.equal(50*2*16);
            });
        });
    });

/**
 * FINDBYID TEST
 */
    describe("findById function", () => {
        before((done) => {
            db.reservation.destroy({where:{}}).then(() => {
                done();
            })
            
        });

        it("should throw an error if id is null", async () => {
            await expect(Reservation.findById(null)).to.be.rejectedWith('id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(Reservation.findById("id")).to.be.rejectedWith('should be an integer');
        });

        it("should throw an error if reservation Id does not exist", async () => {
            await expect(Reservation.findById(100000)).to.be.rejectedWith('reservation Id does not exist');
        });

        it("should return the reservation if found", async () => {
            const user = await expect(User.createUser("findByIdValidation@mail.com", "Passw0rd!", "toto", "titi", "0611111100")).to.not.be.rejected;
            const hotel = await expect(Hotel.createHotel("hotel du findById", "12 rue du findById, 14000 Caen", "0611111100", "description", "findById@hotel.com", 50)).to.not.be.rejected;
            const reservation = await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
            const result = await Reservation.findById(reservation.id);
            expect(result).to.have.property('id', reservation.id);
        });

    });

/**
 * FINDBYHOTEL TEST
 */
    describe("findByHotel function", () => {
        before((done) => {
            db.reservation.destroy({where:{}}).then(() => {
                done();
            })
            
        });

        it("should throw an error if hotelId is null", async () => {
            await expect(Reservation.findByHotel(null)).to.be.rejectedWith('id is null');
        });

        it("should throw an error if hotelId is not an integer", async () => {
            await expect(Reservation.findByHotel("id")).to.be.rejectedWith('should be an integer');
        });

        it("should throw an error if hotelId does not exist", async () => {
            await expect(Reservation.findByHotel(100000)).to.be.rejectedWith('hotel Id does not exist');
        });

        it("should return the reservation for hotelId if found", async () => {
            const user = await expect(User.createUser("findByHotelValidation@mail.com", "Passw0rd!", "toto", "titi", "0611111110")).to.not.be.rejected;
            const hotel = await expect(Hotel.createHotel("hotel du findByHotel", "12 rue du findByHotel, 14000 Caen", "0611111110", "description", "findByHotel@hotel.com", 50)).to.not.be.rejected;
            const reservation = await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
            const result = await Reservation.findByHotel(hotel.id);
            expect(result).to.exist;
            expect(result).to.be.an('array');
            expect(result.every(reservation => reservation.hotelId === hotel.id)).to.be.true;
        });

    });

/**
 * FINDBYUSER TEST
 */
    describe("findByUser function", () => {
        before((done) => {
            db.reservation.destroy({where:{}}).then(() => {
                done();
            })
            
        });

        it("should throw an error if userId is null", async () => {
            await expect(Reservation.findByUser(null)).to.be.rejectedWith('id is null');
        });

        it("should throw an error if userId is not an integer", async () => {
            await expect(Reservation.findByUser("id")).to.be.rejectedWith('should be an integer');
        });

        it("should throw an error if userId does not exist", async () => {
            await expect(Reservation.findByUser(100000)).to.be.rejectedWith('user Id does not exist');
        });

        it("should return the reservation for userId if found", async () => {
            const user = await expect(User.createUser("findByUserValidation@mail.com", "Passw0rd!", "toto", "titi", "0611111111")).to.not.be.rejected;
            const hotel = await expect(Hotel.createHotel("hotel du findByUser", "12 rue du findByUser, 14000 Caen", "0611111111", "description", "findByUser@hotel.com", 50)).to.not.be.rejected;
            const reservation = await expect(Reservation.createReservation(new Date("2023-09-15"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
            const result = await Reservation.findByUser(user.id);
            expect(result).to.exist;
            expect(result).to.be.an('array');
            expect(result.every(reservation => reservation.userId === user.id)).to.be.true;
        });

    });

/**
 * UPDATE RESERVATION TEST
 */
    describe('updateReservation function', () => {

        it("should throw an error if id is null", async () => {
            await expect(Reservation.updateReservation(null, {hotelId: 1, userId: 1})).to.be.rejectedWith('id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(Reservation.updateReservation("1", {hotelId: 1, userId: 1})).to.be.rejectedWith('should be an integer');
        });

        it("should throw an error if user has a reservation for the same period", async () => {
            const user = await expect(User.createUser("updateReservation1Validation@mail.com", "Passw0rd!", "toto", "titi", "0621111111")).to.not.be.rejected;
            const hotel = await expect(Hotel.createHotel("hotel du updateReservation1", "12 rue du updateReservation1, 14000 Caen", "0621111111", "description", "updateReservation1@hotel.com", 50)).to.not.be.rejected;
            const reservation1 = await expect(Reservation.createReservation(new Date("2023-09-01"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
            await expect(Reservation.createReservation(new Date("2023-12-01"), new Date("2024-01-01"), 1, user.id, hotel.id)).to.not.be.rejected;
            await expect(Reservation.updateReservation(reservation1.id, {hotelId: hotel.id, userId: user.id, checkin: new Date("2023-11-01"), checkout: new Date("2023-12-10")})).to.be.rejectedWith('User already has a reservation for this period');
        });

        it("should update the reservation", async () => {
            const user = await expect(User.createUser("updateReservation2Validation@mail.com", "Passw0rd!", "toto", "titi", "0622111111")).to.not.be.rejected;
            const hotel = await expect(Hotel.createHotel("hotel du updateReservation2", "12 rue du updateReservation2, 14000 Caen", "0622111111", "description", "updateReservation2@hotel.com", 50)).to.not.be.rejected;
            const reservation1 = await expect(Reservation.createReservation(new Date("2023-09-01"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
            await expect(Reservation.updateReservation(reservation1.id, {hotelId: hotel.id, userId: user.id, checkout: new Date("2023-12-10")})).to.not.be.rejected;
        });

    });

/**
* DELETE RESERVATION TEST
*/
    describe('deleteReservation function', () => {
        before( (done) => {
            db.reservation.destroy({where:{}}).then(() => {
                done();
            })
        });

        it("should throw an error if id is null", async () => {
            await expect(Reservation.deleteReservation(null)).to.be.rejectedWith('id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(Reservation.deleteReservation("1")).to.be.rejectedWith('should be an integer');
        });

        it("should delete the reservation", async () => {
            const user = await expect(User.createUser("deleteReservationValidation@mail.com", "Passw0rd!", "toto", "titi", "0622211111")).to.not.be.rejected;
            const hotel = await expect(Hotel.createHotel("hotel du deleteReservation", "12 rue du deleteReservation, 14000 Caen", "0622211111", "description", "deleteReservation@hotel.com", 50)).to.not.be.rejected;
            const reservation = await expect(Reservation.createReservation(new Date("2023-09-01"), new Date("2023-10-01"), 2, user.id, hotel.id)).to.not.be.rejected;
            await expect(Reservation.deleteReservation(reservation.id)).to.not.be.rejected;
            return await expect(Reservation.findById(reservation.id)).to.be.rejectedWith('reservation Id does not exist');
        });

    });

});
