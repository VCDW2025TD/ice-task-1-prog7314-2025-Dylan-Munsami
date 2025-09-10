const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err.message));


const memeSchema = new mongoose.Schema({
  title: String,
  url: String,
  userId: String,
  createdAt: { type: Date, default: Date.now }
});
const Meme = mongoose.model('Meme', memeSchema);

app.use((req, res, next) => {
  console.log("➡️ Incoming request:", req.method, req.url);
  next();
});


// Routes
app.get('/', (req, res) => res.send('MemeStream API is running!'));

app.post('/memes', async (req, res) => {
  try {
    const meme = new Meme(req.body);
    await meme.save();
    res.status(201).json(meme);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/memes', async (req, res) => {
  try {
    const { userId } = req.query;
    const memes = userId ? await Meme.find({ userId }) : await Meme.find();
    res.json(memes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
