var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
const database = require('../database');

const db_table = "users";

//Get user homepage
router.get("/", (request, response) => {
    response.render("users", {title: "Users"});
});

//Get users to the same panel
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

//Get users with json format
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

//Get one user with json format with _id
router.get("/getusers_json/:id", (request, response) => {
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

//Post new user to rest api
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