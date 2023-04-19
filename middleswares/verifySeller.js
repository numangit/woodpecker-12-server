const {usersCollection} = require('../collections/dbCollections');

//middle ware to verify seller
const verifySeller = async (req, res, next) => {
    
    const decodedEmail = req.decoded.email;
    const query = { email: decodedEmail };
    const user = await usersCollection.findOne(query);

    if (user?.role !== 'seller') {
        return res.status(403).send({ message: 'forbidden access' })
    };

    next();
};

module.exports = verifySeller;