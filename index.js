const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.FT_DB_USER}:${process.env.FT_DB_PASS}@cluster0.33tct4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const productsCollection = client.db("superShop").collection("products");
    const postsCollection = client.db("superShop").collection("posts");
    const commentsCollection = client.db("superShop").collection("comments");


    // ============================== Product Shop =================================

    app.get("/products", async (req, res) => {
      const page = Number(req.query.page);
      const size = Number(req.query.size);

      const options = {
        sort: {
          time: -1,
        },
      };
      const result = await productsCollection
        .find({}, options)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const product = req.body;
      const result = await productsCollection.insertOne(product);
      res.send(result);
    });

    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const query = {
        _id: new ObjectId(id),
      };
      const options = {
        upsert: true,
      };
      const updateProduct = {
        $set: {
          name: product.name,
          brandName: product.brandName,
          productType: product.productType,
          price: product.price,
          rating: product.rating,
          productImageURL: product.productImageURL,
          detailedDescription: product.detailedDescription,
        },
      };

      const result = await productsCollection.updateOne(
        query,
        updateProduct,
        options
      );
      res.send(result);
    });

    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      // const product = req.body
      const query = {
        _id: new ObjectId(id),
      };
      const result = await productsCollection.deleteOne(query);
      res.send(result);
    });

    // =========================== Posts ==============================

    // post method for posts
    app.post("/posts", async (req, res) => {
      const posts = req.body;
      posts.time = new Date();
      const result = await postsCollection.insertOne(posts);
      res.send(result);
    });

    // get method for posts
    app.get("/posts", async (req, res) => {
      const page = Number(req.query.page);
      const size = Number(req.query.size);

      const options = {
        sort: {
          time: -1,
        },
      };

      const result = await postsCollection
        .find({}, options)
        .skip(page * size)
        .limit(size)
        .toArray();
      res.send(result);
    });

    app.get("/posts/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await postsCollection.findOne(query);
      res.send(result);
    });

    // =========================== Comments ==============================

    // post method for posts
    app.post("/comments", async (req, res) => {
      const comments = req.body;
      comments.time = new Date();
      const result = await commentsCollection.insertOne(comments);
      res.send(result);
    });

    // get method for posts
    app.get("/comments", async (req, res) => {
      const result = await commentsCollection.find().toArray();
      res.send(result);
    });

    app.get("/comments/:id", async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id),
      };
      const result = await commentsCollection.findOne(query);
      res.send(result);
    });

    // +++++++++++++++++++++++++++ THE END ++++++++++++++++++++++++++++

    // Send a ping to confirm a successful connection
    await client.db("admin").command({
      ping: 1,
    });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Fresher Shop Server is running.....");
});

app.listen(port, () => {
  console.log(`Fresher Shop Server running Port is ${port}`);
});
