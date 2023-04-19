const { ObjectId } = require('mongodb');
const express = require("express");
const route = express.Router();
const {paymentsCollection} = require('../collections/dbCollections');

//api to store the purchase data in collection
route.post('/payments', async (req, res) => {

    //insert purchase data
    const payment = req.body;
    const result = await paymentsCollection.insertOne(payment);

    //update order data
    const orderId = payment.orderId
    const filter = { _id: ObjectId(orderId) }
    const updatedDoc = {
        $set: {
            paid: true,
            transactionId: payment.transactionId
        }
    };
    const updatedResult = await ordersCollection.updateOne(filter, updatedDoc);

    //update product data
    const productId = payment.productId
    const query = { _id: ObjectId(productId) };
    const options = { upsert: true };
    const updatedProductField = {
        $set: {
            paid: true,
            onStock: false,
            advertised: false
        }
    };
    const updatedProduct = await productsCollection.updateOne(query, updatedProductField, options)
    res.send(result);
});

module.exports = route;