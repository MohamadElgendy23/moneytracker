const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/Transaction.js");
const mongoose = require("mongoose");
const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { name, description, datetime, price } = req.body;
  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    price,
  });
  console.log(transaction);
  res.json(transaction);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.patch("/api/transaction/edit/:id", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
});

app.delete("/api/transaction/delete/:id", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const id = req.params.id;
  const transaction = await Transaction.findByIdAndDelete({ _id: id });
  console.log(transaction);
  res.json(transaction);
});

app.listen(4040, () => {
  console.log("Port listening on 4040");
});
