var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
const database = require('../database');

const db_table = "id_cards";

// Get id cards homepage
router.get("/", (request, response) => {
    response.render("id_cards", {title: "ID Cards"});
});

//Get id cards to the same panel
router.get("/getid_cards", (request, response) => {
    MongoClient.connect(database.db_url, {useNewUrlParser: true}, function (err, client) {
        const collection = client.db(database.db_name).collection(db_table);
        collection.find({}).toArray((error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.render("id_cards", {title: "ID Cards", id_card: result});
        });
    });
});

//Get id cards to json format
router.get("/getid_cards_json", (request, response) => {
    MongoClient.connect(database.db_url, {useNewUrlParser: true}, function (err, client) {
        const collection = client.db(database.db_name).collection(db_table);
        collection.find({}).toArray((error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });
});

//Get one id card to json format with _id
router.get("/getid_cards_json/:id", (request, response) => {
    MongoClient.connect(database.db_url, {useNewUrlParser: true}, function (err, client) {
        const collection = client.db(database.db_name).collection(db_table);
        collection.findOne({ "_id": new ObjectId(request.params.id) }, (error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    });
});

//Post new id card to rest api
router.post("/", (request, response) => {
    MongoClient.connect(database.db_url, {useNewUrlParser: true}, function (err, client) {
        const collection = client.db(database.db_name).collection(db_table);
        var card = {
            username: request.body.username,
            card_id: request.body.card_id,
            name: request.body.name,
            surname: request.body.surname,
            fathersname: request.body.fathersname,
            birthdate: request.body.birthdate
        };
        collection.insertOne(card, (error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            // response.send(result.result);
            response.redirect("/id_cards/getid_cards");
        });
    });
});

module.exports = router;