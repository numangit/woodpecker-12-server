const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const express = require("express");
const route = express.Router();

 //Payment gateway intents API
 route.post('/', async (req, res) => {
    const order = req.body;
    const price = order.productPrice;
    const amount = price * 100;

    const paymentIntent = await stripe.paymentIntents.create({
        currency: 'usd',
        amount: amount,
        "payment_method_types": [
            "card"
        ]
    });
    res.send({
        clientSecret: paymentIntent.client_secret,
    });
});

module.exports = route;