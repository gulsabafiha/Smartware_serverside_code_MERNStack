const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const cors = require("cors");
const { MongoClient } = require("mongodb");
const objectId = require("mongodb").ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ft5t4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//middlewares
app.use(cors());
app.use(express.json());

async function run() {
  try {
    await client.connect();
    const database = client.db("smartware");
    const glassCollection = database.collection("products");
    const glassCollections = database.collection("product");
    const orderCollections = database.collection("orders");
    const reviewCollections = database.collection("reviews");
    const userCollections = database.collection("User");

    //POST API For Services
    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await glassCollection.insertOne(product);
      res.send(result);
    });

    //POST API FOR SERVICE
    app.post("/product", async (req, res) => {
      const product = req.body;
      const result = await glassCollections.insertOne(product);
      res.send(result);
    });

    //GET API FOR SERVICES
    app.get("/product", async (req, res) => {
      const cursor = glassCollections.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    //GET API FOR SERVICES
    app.get("/products", async (req, res) => {
      const cursor = glassCollection.find({});
      const product = await cursor.toArray();
      res.send(product);
    });

    //GET SINGLE SERVICE
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const service = await glassCollection.findOne(query);
      res.json(service);
    });

    //GET ADMIn INFo
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollections.findOne(query);
      let isAdmin = false;
      if (user.role == "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    //POST INFO OF ORDERS
    app.post("/orders", async (req, res) => {
      const order = req.body;
      order.careatedAt = new Date();
      const orderResult = await orderCollections.insertOne(order);
      res.json(orderResult);
    });

    //Get Orders
    app.get("/orders", async (req, res) => {
      let query = {};
      const email = req.query.email;
      if (email) {
        query = { email: email };
      }
      const orders = orderCollections.find(query);
      const order = await orders.toArray();
      res.json(order);
    });

    //DELETE Order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await orderCollections.deleteOne(query);
      res.json(result);
    });

    //DELETE Products
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectId(id) };
      const result = await glassCollection.deleteOne(query);
      console.log(result);
      res.json(result);
    });

    //POST INFO OF Reviewa
    app.post("/review", async (req, res) => {
      const review = req.body;
      review.careatedAt = new Date();
      const orderResult = await reviewCollections.insertOne(review);
      res.json(orderResult);
    });

    //User api created
    app.post("/users", async (req, res) => {
      const user = req.body;
      const userResult = await userCollections.insertOne(user); 
      res.json(userResult);
    });

    //Make ADMIN FUNCTION
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollections.updateOne(filter, updateDoc);
      res.json(result);
    });
  } finally {
    // await client.close
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running Smart ware ");
});
app.listen(port, () => {
  console.log("Running Smartware server on Port", port);
});
