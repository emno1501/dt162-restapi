// Schema för recept

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    recipeName: String,
    ingredients: Array,
    instruction: Array,
    time: Number,
    portions: Number,
    image: String
});

module.exports = mongoose.model("Recipes", recipeSchema);