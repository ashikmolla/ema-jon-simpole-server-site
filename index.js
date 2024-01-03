const express = require("express");
const cors = require('cors');
require('dotenv').config()
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());








const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.EMA_USER}:${process.env.EMA_PASS}@cluster0.hun2r3q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const productCollection = client.db("emaJohnDB").collection("products");


        app.get('/products', async (req, res) => {
            console.log(req.query)
            const page = parseInt(req.query.page) || 0;
            const limit = parseInt(req.query.limit) || 10;
            const skip = page * limit;

            const result = await productCollection.find().skip(skip).limit(limit).toArray();
            res.send(result)

        })
        app.get('/totalProducts', async (req, res) => {
            const result = await productCollection.estimatedDocumentCount();
            res.send({ totalProducts: result })
        })

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            console.log(ids)
            const objectIds = ids.map(id => new ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const result = await productCollection.find(query).toArray();
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);











app.get('/', (req, res) => {
    res.send("John in raning")
})

app.listen(port, () => {
    console.log(`ema jon server is Runing ON: ${port}`)
})