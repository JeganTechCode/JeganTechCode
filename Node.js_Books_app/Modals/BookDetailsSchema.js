var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BooksDetails = new Schema({
    title: String,
    author: String,
    summary: String,
}, { timestamps: true })

module.exports = mongoose.model("BooksDetails", BooksDetails, "BooksDetails")