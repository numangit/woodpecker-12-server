const { ObjectId } = require('mongodb');
const express = require("express");
const route = express.Router();
const verifyJWT = require('../middleswares/verifyJWT');
const {ordersCollection} = require('../collections/dbCollections');

//api to get orders by user email 
route.get('/user', verifyJWT, async (req, res) => {
// route.get('/myOrders', verifyJWT, async (req, res) => {
    const decoded = req.decoded;
    if (decoded.email !== req.query.email) {
        res.send({ message: 'unauthorized access' })
    }
    let query = {};
    if (req.query.email) {
        query = {
            buyerEmail: req.query.email
        }
    }
    const cursor = ordersCollection.find(query);
    const orders = await cursor.toArray();
    res.send(orders);
});

//api to get orders by order id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const order = await ordersCollection.findOne(query);
    res.send(order);
})

//api to post orders data
route.post('/', async (req, res) => {
    const product = req.body;
    const result = await ordersCollection.insertOne(product);
    res.send(result);
});

module.exports = route;