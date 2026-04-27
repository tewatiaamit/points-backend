const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

console.log("SERVER FILE LOADED 🚀");

// ✅ MongoDB Connection (IMPORTANT: db name added)
mongoose.connect("mongodb+srv://amittewatia_db_user:kRPL4vhgkbuQI97f@cluster0.3robjcx.mongodb.net/rewardsDB")
.then(() => console.log("DB connected ✅"))
.catch(err => console.log(err));

// ✅ Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  points: Number
});

const User = mongoose.model("User", userSchema);

// ✅ Home
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// ✅ Test
app.get("/test", (req, res) => {
  console.log("TEST ROUTE HIT 🔥");
  res.send("Test working");
});

// ✅ Create User
app.post("/add-user", async (req, res) => {
  try {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      points: req.body.points
    });

    await newUser.save();

    res.json({ message: "User added ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get User
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.query.email });

    if (!user) return res.json({ points: 0 });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update Points
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

// ✅ Delete User
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

// ✅ PORT FIX (Render ke liye important)
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});