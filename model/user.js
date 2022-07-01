const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
});

const users = mongoose.model('users', schema);

module.exports = users;