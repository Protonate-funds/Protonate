const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./User');

const app = express();

app.use(
  session({
    secret: 'meow',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not found');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = user;
      return res.redirect('/dashboard');
    } else {
      return res.status(401).send('Invalid credentials');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in');
  }
});

app.get('/dashboard', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
  } else {
    res.redirect('/login');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error('Error logging out:', error);
    }
    res.redirect('/login');
  });
});

app.listen(3002, () => {
  console.log('Server started on port 3002');
});
