const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://18:18@passwords.ypet7qk.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((console.log('Connect to MongoDB')))

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  confirmPassword: {
    type: String,
    required: false
  },
  rememberMe: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
