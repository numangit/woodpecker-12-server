const express = require("express");
const route = express.Router();

//category collection
const {productCategoriesCollection} = require('../collections/dbCollections');

//api to get product categories
route.get('/', async (req, res) => {
    const query = {};
    const categories = await productCategoriesCollection.find(query).toArray();
    res.send(categories);
});

module.exports = route;