//note: this is boilerplate code, slightly adapted from an online tutorial
//source: https://zellwk.com/blog/jest-and-mongoose/

/* global beforeAll beforeEach afterEach afterAll */
const {seedDatabase} = require('./seeds');
const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.promise = global.Promise;

async function removeAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        await collection.deleteMany()
    }
}

async function dropAllCollections() {
    const collections = Object.keys(mongoose.connection.collections);
    for (const collectionName of collections) {
        const collection = mongoose.connection.collections[collectionName];
        try {
            await collection.drop();
        } catch (error) {
            // Sometimes this error happens, but you can safely ignore it
            if (error.message === 'ns not found') return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if (error.message.includes('a background operation is currently running')) return;
            console.log(error.message);
        }
    }
}

module.exports = {
    setupDB(databaseName, runSaveMiddleware = false) {
        // Connect to Mongoose
        beforeAll(async () => {
            const url = `mongodb://127.0.0.1/${databaseName}`;
            await mongoose.connect(url, {useNewUrlParser: true});
            await removeAllCollections();
            await dropAllCollections();
        });

        // Seeds database before each test
        beforeEach(async () => {
            await removeAllCollections();
            await seedDatabase(runSaveMiddleware);
        });

        // Cleans up database between each test
        afterEach(async () => {
            await removeAllCollections();
        });

        // Disconnect Mongoose
        afterAll(async () => {
            await dropAllCollections();
            await mongoose.connection.close();
        })
    }
};