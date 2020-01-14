"use strict";
// Importera
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Skapa instans av express
let app = express();

// Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Middleware: Tillåt CRUD-metoder och anrop utifrån
app.all('/api/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Content-Type: application/json; charset=UTF-8");
	next();
});

app.all('/login/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Content-Type: application/json; charset=UTF-8");
	next();
});

// Mongoose-anslutning
// mongoose.connect('mongodb://localhost:27017/recipes', { useMongoClient: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb://EmmaN:emmanorgren1996@emmascluster-shard-00-00-j783x.mongodb.net:27017,emmascluster-shard-00-01-j783x.mongodb.net:27017,emmascluster-shard-00-02-j783x.mongodb.net:27017/test?ssl=true&replicaSet=EmmasCluster-shard-0&authSource=admin&retryWrites=true&w=majority', { useMongoClient: true, useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

//Läs in schema för recept
const Recipes = require("./models/recipes.js");
//Läs in schema för login
const Admin = require("./models/admin.js");

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
    console.log("Connected to db");

    // Metod GET - för att hämta alla recept
    app.get("/api/recipes", function(req, res) {
        
        Recipes.find(function(err, Recipes){
            if(err) {
                res.send(err);
            }
            res.json(Recipes);
        }).sort([["_id", -1]]);
    });

    //Metod GET - för att hämta enskild recept
    app.get("/api/recipes/:id", function(req, res) {
        //Lagra det id-värde som skickats med i url:en i variabeln id
        let id = req.params.id;
        Recipes.find({
            _id: id
        },function(err, Recipes){
            if(err) {
                res.send(err);
            }
            res.json(Recipes);
        });
    });

    //Metod POST - Lägg till recept
    app.post("/api/recipes/add", function(req, res) {
        //Ny instans av Recipes
        let recipe = new Recipes();

        //Skapa objekt
        recipe.recipeName = req.body.recipeName;
        recipe.ingredients = req.body.ingredients;
        recipe.instruction = req.body.instruction;
        recipe.time = req.body.time;
        recipe.portions = req.body.portions;
        recipe.image = req.body.image;

        //Spara recept till databas och skriv ut ev. felmeddelanden
        recipe.save(function(err) {
            if(err) {
                res.send(err);
            }
            res.json({message: "Recept tillagd"});
        });

    });

    //Metod PUT - Uppdatera recept
    app.put("/api/recipes/update/:id", function(req, res) {
        //Lagra det id-värde som skickats med i url:en i variabeln id
        let id = req.params.id;
        //Variabler med värden som skickats i anropet
        if(req.body.recipeName && req.body.ingredients && req.body.instruction && req.body.time && req.body.portions && req.body.image) {
            let recipeName = req.body.recipeName;
            let ingredients = req.body.ingredients;
            let instruction = req.body.instruction;
            let time = req.body.time;
            let portions = req.body.portions;
            let image = req.body.image;

            Recipes.updateOne({
                _id: id
            },{
                $set: {recipeName: recipeName, ingredients: ingredients, instruction: instruction, time: time, portions: portions, image: image}
            }, function(err, Recipes) {
                if(err) {
                    res.send(err);
                }
                res.json({message: "Recept uppdaterad"});
            });
        } else {
            res.json({message: "Inga värden"});
        }
    });

    //Metod DELETE - Ta bort recept
    app.delete("/api/recipes/delete/:id", function(req, res) {
        //Lagra det id-värde som skickats med i url:en i variabeln id
        let id = req.params.id;
        Recipes.deleteOne({
            _id: id
        }, function(err, Recipes) {
            if(err) {
                res.send(err);
            }
            res.json({message: "Recept raderad"});
        });
    });

    /////////////////////////////////////////////
    // Logga in admin
    ////////////////////////////////////////////

    // Metod GET - för att hämta alla recept
    app.get("/login/get", function(req, res) {
        
        Admin.find(function(err, Admin){
            if(err) {
                res.send(err);
            }
            res.json(Admin);
        });
    });

    //Metod PUT - Uppdatera recept
    app.put("/login/update/:id", function(req, res) {
        //Lagra det id-värde som skickats med i url:en i variabeln id
        let id = req.params.id;
        //Variabler med värden som skickats i anropet
        if(req.body.username && req.body.password) {
            let username = req.body.username;
            let password = req.body.password;

            Recipes.updateOne({
                _id: id
            },{
                $set: {username: username, password: password}
            }, function(err, Admin) {
                if(err) {
                    res.send(err);
                }
                res.json({message: "Inloggningsuppgifter uppdaterade"});
            });
        } else {
            res.json({message: "Inga värden"});
        }
    });
    // Lägga till admin
    /* app.post("/login/add", function(req, res) {
        //Ny instans av Recipes
        let admin = new Admin();

        //Skapa objekt
        admin.username = req.body.username;
        admin.password = req.body.password;

        //Spara recept till databas och skriv ut ev. felmeddelanden
        admin.save(function(err) {
            if(err) {
                res.send(err);
            }
            res.json({message: "Admin tillagd"});
        });

    }); */
});

//Nummer för vilken port den lokala servern ska starta på
let port = 3000;

//Starta server
app.listen(port, function() {
    console.log("Servern startad på port " + port);
});