const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    fullname: String,
    nip: String,
    phone: String,
    email: String,
    address: String,
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended']
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Employee = mongoose.model('Employee', schema);

module.exports = Employee;