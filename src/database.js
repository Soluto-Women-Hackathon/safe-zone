const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.DATABASE_URL;

// Database Name
const dbName = process.env.PROJECT_NAME;

const collectionName = 'geometric';

const insertDocuments = function(db, coordinates, type, callback) {
    const collection = db.collection(collectionName);
    collection.insertOne({
        location: {
            type: 'Point',
            coordinates,
        },
        icon: type
    }, callback);
};

const findPoints = function(db, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({ "location.type": "Point" }).toArray(function(err, docs) {
        callback(docs);
    });
};

const findPolygons = function(db, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find({ type: "Polygon" }).toArray(function(err, docs) {
        callback(docs);
    });
};

const getPoints = callback => {
    MongoClient.connect(url, function(err, client) {
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findPoints(db, points => {
            callback(points);
            client.close()
        })

    });
};

const getPolygons = callback => {
    MongoClient.connect(url, function(err, client) {
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findPolygons(db, polygons => {
            callback(polygons);
            client.close()
        })

    });
};

module.exports = {
    getPoints,
    getPolygons
};
