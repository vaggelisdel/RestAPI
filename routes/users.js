var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const database = require('../database');

const db_table = "users";


router.get("/", (request, response) => {
    response.render("users", {title: "Users"});
});

router.get("/getusers", (request, response) => {
    MongoClient.connect(database.db_url, {useNewUrlParser: true}, function (err, client) {
        const collection = client.db(database.db_name).collection(db_table);
        collection.find({}).toArray((error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            response.render("users", {title: "Users", user: result});
        });
    });
});

router.get("/getusers_json", (request, response) => {
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
        var newuser = {
            username: request.body.username,
            password: request.body.password,
            email: request.body.email
        };
        collection.insertOne(newuser, (error, result) => {
            if (error) {
                return response.status(500).send(error);
            }
            // response.send(result.result);
            response.redirect("/users");
        });
    });
});

module.exports = router;