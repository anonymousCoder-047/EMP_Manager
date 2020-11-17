
const mongoose = require('mongoose')
module.exports = new mongoose.Schema({
    month: String,
    day: String,
    fn_time: String,
    an_time: String,
    total_leaves: Number
});

