const request = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');

//jest.useFakeTimers();

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close();
    
    done();
});

describe('GET search', () => {
    it("should get search page", (done) => {
        const res = request(app)
            .get('/locations/search')
            .expect(200, done);
    });
});

describe('GET searchvacgeo', () => {
    it("should get search by vaccination with geolocation page", (done) => {
        const res = request(app)
            .get('/locations/searchvacgeo?q=ttt&latitude=-20&longitude=-39')
            .expect(200, done);
    });
});

/*describe('GET index', () => {
    it("should get index page", (done) => {
        const res = request(app)
            .get('/')
            .expect(200, done);
    });
});*/