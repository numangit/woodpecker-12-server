const jwt = require('jsonwebtoken');
const express = require("express");
const route = express.Router();

//api to generate jwt token
route.post('/', (req, res) => {
    const user = req.body;
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' });
    res.send({ token });
});

module.exports = route;