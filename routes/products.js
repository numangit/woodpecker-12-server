const { ObjectId } = require('mongodb');
const express = require("express");
const route = express.Router();
const verifyJWT = require('../middleswares/verifyJWT');
const verifySeller = require('../middleswares/verifySeller');
const {productsCollection} = require('../collections/dbCollections');

//api to get products based on user email
route.get('/user', async (req, res) => {
// route.get('/myProducts', async (req, res) => {
    let query = {};
    if (req.query.email) {
        query = {
            sellerEmail: req.query.email
        }
    };
    const cursor = productsCollection.find(query);
    const products = await cursor.toArray();
    res.send(products);
});    

//api to get advertised products
route.get('/advertised', async (req, res) => {
// route.get('/advertisedProducts', async (req, res) => {
    const query = { advertised: true };
    const products = await productsCollection.find(query).toArray();
    res.send(products);
});

//api to get reported products
route.get('/reported', async (req, res) => {
// route.get('/products/reported', async (req, res) => {
    const query = { reported: true };
    const products = await productsCollection.find(query).toArray();
    res.send(products);
});

//api to get products by category id
route.get('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { productCategory: id };
    const products = await productsCollection.find(query).toArray();
    res.send(products);
});

//api get products by category id
// route.get('/products/:id', async (req, res) => {
//     const id = req.params.id;
//     const query = { productCategory: id };
//     // const query = { $and: [{ productCategory: { $exist: id } }, { onStock: { $exist: true } }] };
//     const products = await productsCollection.find(query).toArray();
//     res.send(products);
// })

//api to add products data 
route.post('/', verifyJWT, verifySeller, async (req, res) => {
    const product = req.body;
    const result = await productsCollection.insertOne(product);
    res.send(result);
});

//api to add the reported field on product
route.put('/reported/:id', async (req, res) => {
// route.put('/product/report/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            reported: true
        }
    };
    const result = await productsCollection.updateOne(query, updatedDoc, options);
    res.send(result);
});

//api to add the advertise field on product
route.put('/advertised/:id', verifyJWT, async (req, res) => {
// route.put('/product/advertise/:id', verifyJWT, async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            advertised: true
        }
    };
    const result = await productsCollection.updateOne(query, updatedDoc, options);
    res.send(result);
});

//api to add verified field to product seller by email
route.put('/sellerVerify/:id', async (req, res) => {
    const email = req.params.id;
    const query = { sellerEmail: email };
    const options = { upsert: true };
    const updatedDoc = {
        $set: {
            sellerVerified: true
        }
    };
    const result = await productsCollection.updateMany(query, updatedDoc, options);
    res.send(result);
});

//api to delete product
route.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await productsCollection.deleteOne(query);
    res.send(result);
});

module.exports = route;