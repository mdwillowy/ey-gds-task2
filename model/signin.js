const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const signInSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    college: {
        type: String,
        required: true
    },
    roll: {
        type: Number,
        required: true
    },
    dob: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('SignIn', signInSchema);