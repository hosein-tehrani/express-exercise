const connectToMongoDB = require("./utils/mongodb-connection");
const express = require("express");
const { ObjectId } = require("mongodb");
const dbPromise = new connectToMongoDB().Get();
const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded());
app.get("/", (req, res) => {
  console.log("welcome");
  res.statusCode = 200;
  res.send(
    `<div>
      <h1>welcome to expressJS!!!</h1>
      <a href="/products">go to products</a>
    </div>`,
  );
  // or
  // res.status(200).send({ message: "welcome to expressJS!" });
});
app.get("/products", async (req, res) => {
  const db = await dbPromise;

  const products = await db
    .collection("products")
    .find({})
    .sort({ _id: 1 })
    .toArray();
  res.send({ statusCode: 200, data: { products: products } });
});
app.post("/products", async (req, res) => {
  const db = await dbPromise;
  const product = req.body;
  if (product.name && product.price) {
    const result = await db.collection("products").insertOne(product);
    return res.send({ statusCode: 200, data: { result: result } });
  } else {
    return res.send({
      statusCode: 404,
      data: { message: "import name and price correct!" },
    });
  }
});
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const db = await dbPromise;
  const product = await db
    .collection("products")
    .findOne({ _id: new ObjectId(id) });
  if (!product) {
    res.status(404).send({
      status: 404,
      error: {
        message: "product not found!",
      },
    });
  } else {
    res.send({ statusCode: 200, data: { product: product } });
  }
});
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  const db = await dbPromise;
  const product = req.body;
  const result = await db
    .collection("products")
    .updateOne({ _id: new ObjectId(id) }, { $set: product });
  console.log(result);

  if (!result.matchedCount) {
    res.status(404).send({
      status: 404,
      error: {
        message: "product not found!",
      },
    });
  } else {
    res.send({ statusCode: 200, data: { product: product } });
  }
});
app.listen(PORT, () => {
  console.log("app serverd successfully: http://localhost:" + PORT);
});
