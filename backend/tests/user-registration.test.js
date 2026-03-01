const request = require('supertest');
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const express = require('express');
const userController = require('../src/controllers/user.controller');
const User = require('../src/entities/user.entity');

let mongoServer;

// Configuramos una app de Express temporal para el test
const app = express();
app.use(express.json());
app.post('/api/users/register', userController.register);

jest.setTimeout(30000);

describe('Integration Test: User Registration', () => {

    // Conexión a la base de datos de QA/Test antes de empezar
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
            // Nota: 'mongo' es el nombre del servicio en tu docker-compose.yml
            const fallbackUri = 'mongodb://mongo:27017/schedio_test';
            await mongoose.connect(fallbackUri);
        }
    });

    // Limpiar la colección de usuarios después de cada test para que sean independientes
    afterEach(async () => {
        await User.deleteMany({});
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

    it('Should register a new user and return 201', async () => {
        const newUser = {
            firstName: 'Test',
            lastName: 'Jenkins',
            email: 'test.jenkins@example.com',
            password: 'password123',
            birthDate: '2003-05-31'
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser);

        expect(response.statusCode).toBe(201);
        expect(response.body).toHaveProperty('email', newUser.email);
        // verify password is hashed
        expect(response.body.password).not.toBe(newUser.password);
    });

    it('Should fail with 400 if the email is already in use', async () => {
        const userData = {
            firstName: 'Duplicated',
            lastName: 'User',
            email: 'duplicate@example.com',
            password: 'password123',
            birthDate: '2003-05-31'
        };

        await request(app).post('/api/users/register').send(userData);

        // Try to insert a second user with the same email
        const response = await request(app).post('/api/users/register').send(userData);

        expect(response.statusCode).toBe(400);
        expect(response.body.message).toMatch(/exists/i);
    });
});