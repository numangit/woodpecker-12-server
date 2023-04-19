const { MongoClient, ServerApiVersion } = require('mongodb');

//connection with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zbie1as.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//connection to database
const dbConnect = async () => {
    try {
      await client.connect();
      console.log('Database Connected');
    } catch (error) {
      res.send({
        success: false,
        error: error.message
      })
    }
  };

module.exports = {client, dbConnect};