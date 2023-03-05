const chai = require('chai');
const expect = chai.expect;
const assert = chai.assert;
chai.use(require('chai-as-promised'));
const Hotel = require('../services/hotel.service');
const db = require('../models');

describe('Hotel', () => {

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
 * CREATE HOTEL TEST
 */

    describe('createHotel function', () => {

        describe("name validation", () => {
                
            it("should throw an error when name is null", async () => {
                await expect(Hotel.createHotel(null, "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith("name is null");
            });
        
            it("should throw an error when name is more than 50 characters", async () => {
                await expect(Hotel.createHotel("a".repeat(51), "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith("name is more than 50 characters");
            });
        
            it("should throw an error when name is empty or not a string", async () => {
                await expect(Hotel.createHotel("", "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel([], "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel({}, "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel(12, "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
            });
        
            it("should throw an error when name contains special character", async () => {
                await expect(Hotel.createHotel("h%tel", "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.be.rejectedWith('should not contains specials characters');
            });
        
            it("should create an hotel when name is valid", async () => {
                await expect(Hotel.createHotel("hotel du corbeau", "12 rue du corbeau, 14000 Caen", "0111111111", "description", "corbeau@hotel.com", 50)).to.not.be.rejected;
            });
        });

        describe("address validation", () => {
                
            it("should throw an error when address is null", async () => {
                await expect(Hotel.createHotel("hotel du chat", null, "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("address is null");
            });
        
            it("should throw an error when address is more than 50 characters", async () => {
                await expect(Hotel.createHotel("hotel du chat", "a".repeat(51), "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("address is more than 50 characters");
            });
        
            it("should throw an error when name is empty or not a string", async () => {
                await expect(Hotel.createHotel("hotel du chat", "", "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du chat", [], "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du chat", {}, "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du chat", 12, "0222222222", "description", "chat@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
            });
        
            it("should create an hotel when address is valid", async () => {
                await expect(Hotel.createHotel("hotel du chat", "12 rue du chat, 14000 Caen", "0222222222", "description", "chat@hotel.com", 50)).to.not.be.rejected;
            });
        });

        describe("phone validation", () => {
                
            it("should throw an error when phone is null", async () => {
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", null, "description", "chien@hotel.com", 50)).to.be.rejectedWith("phone is null");
            });
        
            it("should throw an error when phone is empty or not a string", async () => {
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "", "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", [], "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", {}, "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", 12, "description", "chien@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
            });
        
            it("should throw an error when phone is not valid", async () => {
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "+33606060606345", "description", "chien@hotel.com", 50)).to.be.rejectedWith('invalid phone');
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "+33606", "description", "chien@hotel.com", 50)).to.be.rejectedWith('invalid phone');
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "+3360+454545", "description", "chien@hotel.com", 50)).to.be.rejectedWith('invalid phone');
            });
        
            it("should create an hotel when phone is valid", async () => {
                await expect(Hotel.createHotel("hotel du chien", "12 rue du chien, 14000 Caen", "0333333333", "description", "chien@hotel.com", 50)).to.not.be.rejected;
            });
        });

        describe("email validation", () => {
                
            it("should throw an error when email is null", async () => {
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", null, 50)).to.be.rejectedWith("email is null");
            });
        
            it("should throw an error when email is more than 50 characters", async () => {
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "r".repeat(51)+"at@hotel.com", 50)).to.be.rejectedWith("email is more than 50 characters");
            });
        
            it("should throw an error when email is empty or not a string", async () => {
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", [], 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", {}, 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", 12, 50)).to.be.rejectedWith("should be a string not empty");
            });
        
            it("should throw an error when email is not valid", async () => {
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rathotel.com", 50)).to.be.rejectedWith('invalid email');
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rat@hotel", 50)).to.be.rejectedWith('invalid email');
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rathotel", 50)).to.be.rejectedWith('invalid email');
            });
        
            it("should create an hotel when name is valid", async () => {
                await expect(Hotel.createHotel("hotel du rat", "12 rue du rat, 14000 Caen", "0444444444", "description", "rat@hotel.com", 50)).to.not.be.rejected;
            });
        });

        describe("description validation", () => {
                
            it("should throw an error when description is null", async () => {
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", null, "ver@hotel.com", 50)).to.be.rejectedWith("description is null");
            });
        
            it("should throw an error when description is more than 100 characters", async () => {
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", "d".repeat(101), "ver@hotel.com", 50)).to.be.rejectedWith("description is more than 100 characters");
            });
        
            it("should throw an error when description is empty or not a string", async () => {
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", "", "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", [], "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", {}, "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", 12, "ver@hotel.com", 50)).to.be.rejectedWith("should be a string not empty");
            });
        
            it("should create an hotel when description is valid", async () => {
                await expect(Hotel.createHotel("hotel du ver", "12 rue du ver, 14000 Caen", "0555555555", "description", "ver@hotel.com", 50)).to.not.be.rejected;
            });
        });

        describe("price validation", () => {
                
            it("should throw an error when price is null", async () => {
                await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", null)).to.be.rejectedWith("price is null");
            });
        
            it("should throw an error when price is not an integer", async () => {
                await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", "50")).to.be.rejectedWith("should be an integer");
                await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", [])).to.be.rejectedWith("should be an integer");
                await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", {})).to.be.rejectedWith("should be an integer");
            });
        
            it("should create an hotel when price is valid", async () => {
                await expect(Hotel.createHotel("hotel du crocodile", "12 rue du crocodile, 14000 Caen", "0666666666", "description", "crocodile@hotel.com", 50)).to.not.be.rejected;
            });
        });

        describe("create Hotel validation", () => {
        
            it("should throw an error when Hotel already exist", async () => {
                await expect(Hotel.createHotel("hotel du castor", "12 rue du castor, 14000 Caen", "0999988776", "description", "castor@hotel.com", 50)).to.not.be.rejected;
                await expect(Hotel.createHotel("hotel du lapin", "12 rue du lapin, 14000 Caen", "0119911987", "description", "castor@hotel.com", 50)).to.be.rejectedWith("Hotel email already exist");
                await expect(Hotel.createHotel("hotel du sac", "12 rue du sac, 14000 Caen", "0999988776", "description", "sac@hotel.com", 50)).to.be.rejectedWith("Hotel phone already exist");
                await expect(Hotel.createHotel("hotel du bras", "12 rue du castor, 14000 Caen", "0519911987", "description", "bras@hotel.com", 50)).to.be.rejectedWith("Hotel address already exist");
            });
        
        });

    });

    /**
 * FIND BY ID TEST
 */
    describe('findById function', () => {
        before((done) => {
            db.hotel.destroy({where:{}}).then(() => {
                done();
            })
            
        });

        it("should throw an error if id is null", async () => {
            await expect(Hotel.findById(null)).to.be.rejectedWith('id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(Hotel.findById("id")).to.be.rejectedWith('should be an integer');
        });

        it("should throw an error if hotel Id does not exist", async () => {
            await expect(Hotel.findById(100000)).to.be.rejectedWith('hotel Id does not exist');
        });

        it("should return the hotel if found", async () => {
            const hotel = await Hotel.createHotel("hotel du lion", "12 rue du lion, 14000 Caen", "0777777777", "description", "lion@hotel.com", 50);
            const result = await Hotel.findById(hotel.id);
            expect(result).to.have.property('id', hotel.id);
        });

    });

/**
 * FIND BY NAME TEST
 */
    describe('findByName function', () => {

        it("should throw an error if name is null", async () => {
            await expect(Hotel.findByName(null)).to.be.rejectedWith('name is null');
        });

        it("should throw an error if name is not a string", async () => {
            await expect(Hotel.findByName(123)).to.be.rejectedWith('should be a string');
        });

        it("should return the hotel if found", async () => {
            const resultList = await Hotel.findByName("hotel du lion");
            expect(resultList).to.exist;
            expect(resultList).to.be.an('array');
            expect(resultList.every(hotel => hotel.name === "hotel du lion")).to.be.true;
        });

    });

/**
 * FIND BY ADDRESS TEST
 */
    describe('findByAddress function', () => {

        it("should throw an error if address is null", async () => {
            await expect(Hotel.findByAddress(null)).to.be.rejectedWith('address is null');
        });

        it("should throw an error if address is not a string", async () => {
            await expect(Hotel.findByAddress(06)).to.be.rejectedWith('should be a string');
        });

        it("should return the hotel if found", async () => {
            const result = await Hotel.findByAddress("12 rue du lion, 14000 Caen");
            expect(result).to.have.property('name', "hotel du lion");
            expect(result).to.have.property('email', "lion@hotel.com");
        });

    });

/**
 * UPDATE HOTEL TEST
 */
    describe('UpdateHotel function', () => {

        it("should throw an error if id is null", async () => {
            await expect(Hotel.updateHotel(null, {})).to.be.rejectedWith('id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(Hotel.updateHotel("1", {})).to.be.rejectedWith('should be an integer');
        });

        it("should throw an error if email is already used", async () => {
            await Hotel.createHotel("hotel du danger", "12 rue du danger, 14000 Caen", "0888888999", "description", "danger@hotel.com", 50);
            const result = await Hotel.createHotel("hotel du singe", "12 rue du singe, 14000 Caen", "0888888888", "description", "singe@hotel.com", 50);
            await expect(Hotel.updateHotel(result.id, {email: "danger@hotel.com"})).to.be.rejectedWith('email already exist');
        });

        it("should throw an error if phone is already used", async () => {
            await Hotel.createHotel("hotel du barrage", "12 rue du barrage, 14000 Caen", "0888888777", "description", "barrage@hotel.com", 50);
            const result = await Hotel.createHotel("hotel du leopard", "12 rue du leopard, 14000 Caen", "0999999666", "description", "leopard@hotel.com", 50);
            await expect(Hotel.updateHotel(result.id, {phone: "0888888777"})).to.be.rejectedWith('phone already exist');
        });

        it("should update the hotel", async () => {
            const hotelObj = await Hotel.createHotel("hotel du dome", "12 rue du dome, 14000 Caen", "0111111119", "description", "dome@hotel.com", 50);
            await expect(Hotel.updateHotel(hotelObj.id, {name: "hotel du puit"})).to.not.be.rejected;
            const result = await Hotel.findById(hotelObj.id);
            expect(result).to.have.property('name', 'hotel du puit');
        });

    });

/**
* DELETE HOTEL TEST
*/
    describe('DeleteHotel function', () => {
        before( (done) => {
            db.hotel.destroy({where:{}}).then(() => {
                done();
            })
        });

        it("should throw an error if id is null", async () => {
            await expect(Hotel.deleteHotel(null)).to.be.rejectedWith('id is null');
        });

        it("should throw an error if id is not an integer", async () => {
            await expect(Hotel.deleteHotel("1")).to.be.rejectedWith('should be an integer');
        });

        it("should delete the hotel", async () => {
            const hotelObj = await Hotel.createHotel("hotel du bois", "12 rue du bois, 14000 Caen", "0222222229", "description", "bois@hotel.com", 50);
            await expect(Hotel.deleteHotel(hotelObj.id)).to.not.be.rejected;
            return await expect(Hotel.findById(hotelObj.id)).to.be.rejectedWith('hotel Id does not exist');
        });

    });

});


