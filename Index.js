const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//import api routes
const users = require('./routes/users'); 
const categories = require('./routes/productCategories');
const orders = require('./routes/orders');
const products = require('./routes/products');
const jwt = require('./routes/jwt');
const payments = require('./routes/payments');
const strip = require('./routes/strip');

async function run() {
    try {
        //categories
        app.use('/productCategories', categories);
        
        //jwt
        app.use('/jwt', jwt);
        
        //orders
        app.use('/orders', orders);
        
        //payments
        app.use('/payments', payments);
        
        //products
        app.use('/products',products);

        //strip
        app.use('/create-payment-intent', strip);
        
        //users
        app.use('/users',users);
    }
    finally {
    }
}

run().catch(console.log);


app.get('/', async (req, res) => {
    res.send('Woodpecker server is running')
});

app.listen(port, () => {
    console.log(`Woodpecker running on ${port}`)
});