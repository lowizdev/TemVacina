const request = require('supertest');
const app = require('../index.js');
const mongoose = require('mongoose');

//jest.useFakeTimers();

afterAll(done => {
    // Closing the DB connection allows Jest to exit successfully.
    mongoose.connection.close();
    done();
});

describe('GET index', () => {
    it("should get index page", (done) => {
        const res = request(app)
            .get('/')
            .expect(200, done);
            
    });
});