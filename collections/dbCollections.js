 const client = require('../database/mongodb.config');
 
 //database collections
 const ordersCollection = client.db('woodpecker12').collection('orders');
 const paymentsCollection = client.db('woodpecker12').collection('payments');
 const productCategoriesCollection = client.db('woodpecker12').collection('productCategories');
 const productsCollection = client.db('woodpecker12').collection('products');
 const usersCollection = client.db('woodpecker12').collection('users');

 module.exports = {
    ordersCollection, 
    paymentsCollection, 
    productCategoriesCollection, 
    productsCollection, 
    usersCollection
};