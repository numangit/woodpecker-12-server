const { ObjectId } = require('mongodb');
const express = require("express");
const route = express.Router();
const verifyJWT = require('../middleswares/verifyJWT');

// user collection
const {usersCollection} = require('../collections/dbCollections');

//api to get all user
route.get('/', async (req, res) => {
    const query = {};
    const users = await usersCollection.find(query).toArray();
    res.send(users);
});

//api to get user by email
route.get('/', async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const user = await usersCollection.findOne(query);
    res.send(user);
});

//api to check  user role
route.get('/role/:email', async (req, res) => {
    const email = req.params.email;
    const query = { email };
    const user = await usersCollection.findOne(query);
    res.send(user);
});        

//post user data to the users collections and if user exist then send status 403
route.post('/', async (req, res) => {
    const email = req.body.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    if (!user) {
        const user = req.body;
        const result = await usersCollection.insertOne(user);
        return res.send(result);
    };
    res.status(403).send({ message: 'User already exists' });
});        

//api to add verified field to user
route.put('/verify/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            verified: true
        }
    };
    const result = await usersCollection.updateOne(query, updatedDoc, options);
    res.send(result);
});

module.exports = route;