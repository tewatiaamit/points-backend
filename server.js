const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

console.log("SERVER FILE LOADED 🚀");

// ✅ MongoDB Connection
mongoose.connect("mongodb+srv://amittewatia_db_user:kRPL4vhgkbuQI97f@cluster0.3robjcx.mongodb.net/rewardsDB")
.then(() => console.log("DB connected ✅"))
.catch(err => console.log(err));

// =======================
// ✅ USER MODEL
// =======================
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  points: Number
});

const User = mongoose.model("User", userSchema);

// =======================
// ✅ PRODUCT MODEL
// =======================
const productSchema = new mongoose.Schema({
  name: String,
  points: Number,
  image: String,
  active: Boolean
});

const Product = mongoose.model("Product", productSchema);

// =======================
// ✅ ROUTES
// =======================

// Home
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// Test
app.get("/test", (req, res) => {
  res.send("Test working");
});

// =======================
// 👤 USER APIs
// =======================

// Add User
app.post("/add-user", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.json({ message: "User added ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get User
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) return res.json({ points: 0 });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update User Points
app.put("/update-user", async (req, res) => {
  try {
    const { email, points } = req.body;

    const user = await User.findOneAndUpdate(
      { email },
      { points },
      { new: true }
    );

    if (!user) return res.json({ message: "User not found ❌" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete User
app.delete("/delete-user", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOneAndDelete({ email });

    if (!user) return res.json({ message: "User not found ❌" });

    res.json({ message: "User deleted 🗑️" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 🛍️ PRODUCT APIs
// =======================

// Add Product
app.post("/add-product", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.json({ message: "Product added ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Products
app.get("/products", async (req, res) => {
  try {
    const products = await Product.find({ active: true });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Product
app.put("/update-product", async (req, res) => {
    try {
      const { id, name, points, image, active } = req.body;
  
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, points, image, active },
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found ❌" });
      }
  
      res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Delete Product
app.delete("/delete-product", async (req, res) => {
  try {
    const { id } = req.body;

    await Product.findByIdAndDelete(id);

    res.json({ message: "Product deleted ❌" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// 🚀 SERVER START
// =======================
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});