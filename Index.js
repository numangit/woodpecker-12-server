const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

//connection with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zbie1as.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        //database collections
        const productCategoriesCollection = client.db('woodpecker12').collection('productCategories');
        const usersCollection = client.db('woodpecker12').collection('users');
        const productsCollection = client.db('woodpecker12').collection('products');

        //api to get product categories
        app.get('/productCategories', async (req, res) => {
            const query = {};
            const categories = await productCategoriesCollection.find(query).toArray();
            res.send(categories);
        });

        //api to get all user
        app.get('/users', async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        //api to get user by email
        app.get('/users', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        //api to check  user role
        app.get('/users/role/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email }
            const user = await usersCollection.findOne(query);
            res.send(user);
        })

        //post user data to the users collections
        app.post('/users', async (req, res) => {
            const user = req.body;
            console.log(user);
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //api to get products based on user email
        app.get('/myProducts', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    sellerEmail: req.query.email
                }
            }
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        //api to delete user product
        app.delete('/myProducts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })

        //api get products by category id
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { productCategory: id };
            const products = await productsCollection.find(query).toArray();
            res.send(products);
        })

        //api to add products data (REMINDER: VERIFY USER TO BE SELLER USING MIDDLEWARE OR REJECT THE REQUEST)
        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.send(result);
        });

        //api to add the advertise field on product
        app.put('/product/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    advertised: true
                }
            }
            const result = await productsCollection.updateOne(query, updatedDoc, options);
            res.send(result);
        })

        //api to update the advertise field on product (didnt check if working)
        app.patch('/product/advertise/:id', async (req, res) => {
            const id = req.params.id;
            const advertised = req.body.advertised;
            const query = { _id: ObjectId(id) }
            const updatedDoc = {
                $set: {
                    advertised: advertised
                }
            }
            const result = await productsCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

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