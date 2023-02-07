const express = require('express');
const cors = require('cors');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@clusterarfan36.opuzllc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// jwt token middleware
function verifyJWT(req, res, next) {
   const authHeader = req.headers.authorization;
   if (!authHeader) {
      return res.status(401).send({ message: 'unauthorized access' });
   }
   const token = authHeader.split(' ')[1];
   jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
      if (err) {
         return res.status(403).send('forbidden access');
      }
      req.decoded = decoded;
      next();
   });
}

async function run() {
   try {
      const productsCollection = client.db('moonTech').collection('products');

      app.get('/products', async (req, res) => {
         res.send(await productsCollection.find({}).toArray());
      });

   }
   finally {

   }
}

run().catch(err => console.log(err));

app.get('/', (req, res) => {
   res.send('Server running');
});

app.listen(port, () => {
   console.log(`Listening to port ${port}`);
});