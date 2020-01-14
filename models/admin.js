// Schema för admin - inloggning

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let adminSchema = new Schema({
    username: String,
    password: String
});

module.exports = mongoose.model("Admin", adminSchema);