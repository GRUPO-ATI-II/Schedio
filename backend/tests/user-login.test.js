const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const userController = require('../src/controllers/user.controller');
const User = require('../src/entities/user.entity');

let mongoServer;

const app = express();
app.use(express.json());
app.post('/api/users/login', userController.login);

jest.setTimeout(30000);

describe('Integration Test: User Login', () => {

    beforeAll(async () => {
        try {
            // Intentamos levantar el servidor en memoria
            mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            await mongoose.connect(uri);
            console.log("Using MongoMemoryServer");
        } catch (error) {
            console.warn("Could not set up MongoMemoryServer");
            console.log("Connecting with Mongo real container...");

            // Si falla, conectamos al contenedor de mongo de tu docker-compose
            const fallbackUri = 'mongodb://mongo:27017/schedio_test';
            await mongoose.connect(fallbackUri);
        }

        const userService = require('../src/services/user.service');
        const userData = {
            firstName: 'Login',
            lastName: 'Test',
            email: 'login@example.com',
            password: 'correctPassword123',
            birthDate: '2005-09-03'
        };
        await userService.registerUser(userData);
    });

    // Poor jenkins needs this
    afterAll(async () => {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        if (mongoServer) {
            await mongoServer.stop();
        }
    });

    it('Should login a user and return 200', async () => {
        const loginCredentials = {
            email: 'login@example.com',
            password: 'correctPassword123'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(loginCredentials);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
        expect(response.body.user).toHaveProperty('email', loginCredentials.email);
        expect(response.body.user).toHaveProperty('id');
    });

    it('Should fail with 401 if the email is not registered', async () => {
        const unknownUser = {
            email: 'nonexisty@example.com',
            password: 'correctPassword123'
        };

        const response = await request(app)
            .post('/api/users/login')
            .send(unknownUser);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatch(/invalid/i);
    });

    it('Should fail with 401 if the password is different', async () => {
        const incorrectPassword = {
            email: 'login@example.com',
            password: 'incorrectPassword123'
        };
        const response = await request(app)
            .post('/api/users/login')
            .send(incorrectPassword);

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toMatch(/invalid/i);
    });
});