var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const database = require('../database');

const db_table = "id_cards";


router.get("/", (request, response) => {
    response.render("id_cards", {title: "ID Cards"});
});

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
            response.redirect("/id_cards");
        });
    });
});

module.exports = router;