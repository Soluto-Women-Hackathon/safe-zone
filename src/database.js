const MongoClient = require('mongodb').MongoClient;

// Connection URL
const url = process.env.DATABASE_URL;

// Database Name
const dbName = process.env.PROJECT_NAME;

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    client.close();
});
