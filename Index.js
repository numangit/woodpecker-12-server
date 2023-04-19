const express = require('express');
const cors = require('cors');
// const { ObjectId } = require('mongodb');
// const jwt = require('jsonwebtoken');
require('dotenv').config();
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const port = process.env.PORT || 5000;
const app = express();
// const {client} = require('./database/mongodb.config');

//middleware
app.use(cors());
app.use(express.json());
// const verifyJWT = require('./middleswares/verifyJWT');
// const verifySeller = require('./middleswares/verifySeller');

//import api routes
const users = require('./routes/users'); 
const categories = require('./routes/productCategories');
const orders = require('./routes/orders');
const products = require('./routes/products');
const jwt = require('./routes/jwt');
const payments = require('./routes/payments');
const strip = require('./routes/strip');

//JWT middleware to verify jwt  
// function verifyJWT(req, res, next) {
//     const authHeader = req.headers.authorization;

//     if (!authHeader) {
//         return res.status(401).send('unauthorized access');
//     }

//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' })
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

async function run() {
    try {
        //database collections
        // const productCategoriesCollection = client.db('woodpecker12').collection('productCategories');
        // const usersCollection = client.db('woodpecker12').collection('users');
        // const productsCollection = client.db('woodpecker12').collection('products');
        // const ordersCollection = client.db('woodpecker12').collection('orders');
        // const paymentsCollection = client.db('woodpecker12').collection('payments');

        // //middle ware to verify seller
        // const verifySeller = async (req, res, next) => {
        //     const decodedEmail = req.decoded.email;
        //     const query = { email: decodedEmail };
        //     const user = await usersCollection.findOne(query);

        //     if (user?.role !== 'seller') {
        //         return res.status(403).send({ message: 'forbidden access' })
        //     }
        //     next();
        // }

        /*
        ----------------- strip intent API ----------------------
        */
        app.use('/create-payment-intent', strip);
        // //Payment gateway intents API
        // app.post('/create-payment-intent', async (req, res) => {
        //     const order = req.body;
        //     const price = order.productPrice;
        //     const amount = price * 100;

        //     const paymentIntent = await stripe.paymentIntents.create({
        //         currency: 'usd',
        //         amount: amount,
        //         "payment_method_types": [
        //             "card"
        //         ]
        //     });
        //     res.send({
        //         clientSecret: paymentIntent.client_secret,
        //     });
        // });

        /*
        ----------------- payment invoice API ----------------------
        */
        app.use('/payments', payments);
        // //api to store the purchase data in collection
        // app.post('/payments', async (req, res) => {
        //     //insert purchase data
        //     const payment = req.body;
        //     const result = await paymentsCollection.insertOne(payment);
        //     //update order data
        //     const orderId = payment.orderId
        //     const filter = { _id: ObjectId(orderId) }
        //     const updatedDoc = {
        //         $set: {
        //             paid: true,
        //             transactionId: payment.transactionId
        //         }
        //     }
        //     const updatedResult = await ordersCollection.updateOne(filter, updatedDoc)
        //     //update product data
        //     const productId = payment.productId
        //     const query = { _id: ObjectId(productId) };
        //     const options = { upsert: true };
        //     const updatedProductField = {
        //         $set: {
        //             paid: true,
        //             onStock: false,
        //             advertised: false
        //         }
        //     }
        //     const updatedProduct = await productsCollection.updateOne(query, updatedProductField, options)
        //     res.send(result);
        // })

        /*
        ----------------- JWT API ----------------------
        */

        app.use('/jwt', jwt);
        //api to generate jwt token
        // app.post('/jwt', (req, res) => {
        //     const user = req.body;
        //     const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1d' })
        //     res.send({ token })
        // })

        /*
        ----------------- CATEGORY API ----------------------
        */

        app.use('/productCategories', categories);
        // //api to get product categories
        // app.get('/productCategories', async (req, res) => {
        //     const query = {};
        //     const categories = await productCategoriesCollection.find(query).toArray();
        //     res.send(categories);
        // });

        /*
        ----------------- USER API ----------------------
        */

        app.use('/users',users);

        // //api to get all user
        // app.get('/users', async (req, res) => {
        //     const query = {}
        //     const users = await usersCollection.find(query).toArray();
        //     res.send(users);
        // })

        // //api to get user by email
        // app.get('/users', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email }
        //     const user = await usersCollection.findOne(query);
        //     res.send(user);
        // })

        // //api to check  user role
        // app.get('/users/role/:email', async (req, res) => {
        //     const email = req.params.email;
        //     const query = { email }
        //     const user = await usersCollection.findOne(query);
        //     res.send(user);
        // })

        // //post user data to the users collections and if user exist then send status 403
        // app.post('/users', async (req, res) => {
        //     const email = req.body.email;
        //     const query = { email: email };
        //     const user = await usersCollection.findOne(query);
        //     if (!user) {
        //         const user = req.body;
        //         const result = await usersCollection.insertOne(user);
        //         return res.send(result);
        //     }
        //     res.status(403).send({ message: 'User already exists' })
        // });

        // //api to add verified field to user
        // app.put('/users/verify/:id', verifyJWT, async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             verified: true
        //         }
        //     }
        //     const result = await usersCollection.updateOne(query, updatedDoc, options);
        //     res.send(result);
        // })

        //api to get all buyers 
        // app.get('/allBuyers', verifyJWT, async (req, res) => {
        //     const query = { role: "buyer" };
        //     const buyers = await usersCollection.find(query).toArray();
        //     res.send(buyers);
        // })

        // //api to delete buyer
        // app.delete('/allBuyers/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await usersCollection.deleteOne(query);
        //     res.send(result);
        // })

        // //api to get all buyers 
        // app.get('/allSellers', async (req, res) => {
        //     const query = { role: "seller" };
        //     const buyers = await usersCollection.find(query).toArray();
        //     res.send(buyers);
        // })

        // //api to delete buyer
        // app.delete('/allSellers/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await usersCollection.deleteOne(query);
        //     res.send(result);
        // })

        /*
        ----------------- PRODUCTS API ----------------------
        */
        app.use('/products',products);

        // //api to get products based on user email
        // app.get('/myProducts', async (req, res) => {
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             sellerEmail: req.query.email
        //         }
        //     }
        //     const cursor = productsCollection.find(query);
        //     const products = await cursor.toArray();
        //     res.send(products);
        // });

        // //api to delete product
        // app.delete('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await productsCollection.deleteOne(query);
        //     res.send(result);
        // })

        // //api to get advertised products
        // app.get('/advertisedProducts', async (req, res) => {
        //     const query = { advertised: true };
        //     const products = await productsCollection.find(query).toArray();
        //     res.send(products);
        // })

        // //api to get reported products
        // app.get('/products/reported', async (req, res) => {
        //     const query = { reported: true };
        //     const products = await productsCollection.find(query).toArray();
        //     res.send(products);
        // })

        // //api to get products by id
        // app.get('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { productCategory: id };
        //     const products = await productsCollection.find(query).toArray();
        //     res.send(products);
        // })

        // //api get products by category id
        // app.get('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { productCategory: id };
        //     // const query = { $and: [{ productCategory: { $exist: id } }, { onStock: { $exist: true } }] };
        //     const products = await productsCollection.find(query).toArray();
        //     res.send(products);
        // })

        // //api to add products data 
        // app.post('/products', verifyJWT, verifySeller, async (req, res) => {
        //     const product = req.body;
        //     const result = await productsCollection.insertOne(product);
        //     res.send(result);
        // });

        // //api to add the reported field on product
        // app.put('/product/report/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             reported: true
        //         }
        //     }
        //     const result = await productsCollection.updateOne(query, updatedDoc, options);
        //     res.send(result);
        // })

        // //api to add the advertise field on product
        // app.put('/product/advertise/:id', verifyJWT, async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             advertised: true
        //         }
        //     }
        //     const result = await productsCollection.updateOne(query, updatedDoc, options);
        //     res.send(result);
        // })

        // //api to add verified field to product seller by email
        // app.put('/products/sellerVerify/:id', async (req, res) => {
        //     const email = req.params.id;
        //     const query = { sellerEmail: email };
        //     const options = { upsert: true };
        //     const updatedDoc = {
        //         $set: {
        //             sellerVerified: true
        //         }
        //     }
        //     const result = await productsCollection.updateMany(query, updatedDoc, options);
        //     res.send(result);
        // })

        /*
        ----------------- ORDERS API ----------------------
        */
        app.use('/orders', orders);


        // //api to get Orders based on user email 
        // app.get('/myOrders', verifyJWT, async (req, res) => {
        //     const decoded = req.decoded;
        //     if (decoded.email !== req.query.email) {
        //         res.send({ message: 'unauthorized access' })
        //     }
        //     let query = {};
        //     if (req.query.email) {
        //         query = {
        //             buyerEmail: req.query.email
        //         }
        //     }
        //     const cursor = ordersCollection.find(query);
        //     const orders = await cursor.toArray();
        //     res.send(orders);
        // });

        // //api to get orders by order id
        // app.get('/orders/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const order = await ordersCollection.findOne(query);
        //     res.send(order);
        // })

        // //api to post orders data
        // app.post('/orders', async (req, res) => {
        //     const product = req.body;
        //     const result = await ordersCollection.insertOne(product);
        //     res.send(result);
        // });

    }
    finally {
    }
}

run().catch(console.log)


app.get('/', async (req, res) => {
    res.send('Woodpecker server is running')
});

app.listen(port, () => {
    console.log(`Woodpecker running on ${port}`)
});