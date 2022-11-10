const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.gkdpmwb.mongodb.net/?retryWrites=true&w=majority`;
// const uri = "mongodb://localhost:27017"

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db("vivaVisa").collection("serviceCollection");
        const reviewCollection = client.db("vivaVisa").collection("reviewCollection");

        app.get('/', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query).limit(3);
            const limitService = await cursor.toArray();
            res.send(limitService);
        })
        app.get("/services", async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        app.get("/service/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })

        app.get("/review/:id", async (req, res) => {
            const serviceId = req.params.id;
            const query = { serviceId: serviceId };
            const reviews = reviewCollection.find(query);
            const allReviews = await reviews.toArray();
            res.send(allReviews)
        })
        app.get("/reviews", async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const cursor = reviewCollection.find(query);
            const result = await cursor.toArray();
            res.send(result);
            console.log(result)
        })
        app.post("/services", async (req, res) => {
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })
        app.post("/review/:id", async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.delete("/review/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err))


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})