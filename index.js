const express = require('express');
const path = require('path');
const User = require('./User');

const app = express();



app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'Dashboard.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/account', (req, res) => {
  res.sendFile(path.join(__dirname, 'account.html'));
});
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (user.password !== password) {
      return res.status(401).send('Invalid password');
    }

    res.send('Login successful');

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, rememberMe } = req.body;

    
    const existingUser = await User.findOne({ $or: [{ email }, { name }] });
    if (existingUser) {
      return res.status(400).send('User with the same email or username already exists');
    }

    // if (password !== confirmPassword) {
    //   return res.status(400).send('Passwords do not match');
    // }

    const newUser = new User({
      name,
      email,
      password,
      confirmPassword,
      rememberMe
    });

    await newUser.save();

    res.send('User saved to the database');
    window.location.href="/dashboard";
  } catch (error) {
    console.error('Error saving user to the database:', error);
    res.status(500).send('Error saving user to the database');
  }
});



app.listen(3002, () => {
  console.log('Server started on port 3000');
});
