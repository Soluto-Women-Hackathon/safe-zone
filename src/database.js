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
    collection.find({}).toArray(function(err, docs) {
        callback(docs);
    });
}

// Use connect method to connect to the server
// MongoClient.connect(url, function(err, client) {
//     console.log("Connected successfully to server");
//
//     const db = client.db(dbName);
//
//     // var coordinates = [
//     //     {
//     //         position: [32.0622202,34.77488549999998],
//     //         type: 'safe'
//     //     },
//     //     {
//     //         position: [32.0628413,34.77314239999998],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.06367270000001,34.77277200000003],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0630658,34.77509950000001],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0652763,34.77097320000007],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0623008,34.77226500000006],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0662971,34.771616100000074],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0651611,34.776832199999944],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.06301620000001,34.77190589999998],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0645541,34.772609800000055],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0665213,34.77026799999999],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0648737,34.77224890000002],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0640036,34.77409979999993],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0653263,34.77788959999998],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.06557180000001,34.778560200000015],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.06557180000001,34.778560200000015],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.06810550000001,34.78236659999993],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0658731,34.77847840000004],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0663848,34.776454899999976],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0638792,34.77987800000005],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0660218,34.77490650000004],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0644581,34.77685329999997],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0642335,34.77483749999999],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0638547,34.773504600000024],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0629814,34.776482999999985],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0648235,34.769768200000044],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0644352,34.77188709999996],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0634156,34.77213810000001],
//     //         type: 'unsafe'
//     //     }, {
//     //         position: [32.0659877,34.77548100000001],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0655783,34.775777999999946],
//     //         type: 'safe'
//     //     },  {
//     //         position: [32.0644223,34.77601379999999],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0644223,34.77601379999999],
//     //         type: 'ok'
//     //     }, {
//     //         position: [32.0650006,34.77775500000007],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0641166,34.77255790000004],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0637219,34.771356800000035],
//     //         type: 'safe'
//     //     }, {
//     //
//     //         position: [32.0648007,34.77117499999997],
//     //         type: 'safe'
//     //     }, {
//     //         position: [32.0631476,34.77386899999999],
//     //         type: 'ok'
//     //     },
//     //
//     // ];
//     // coordinates.forEach((data, index) => insertDocuments(db, data.position, data.type, () => {
//     //     if (index < coordinates.length - 1){
//     //         return console.log("insert" + data )
//     //     }
//     //     client.close();
//     // }));
//
//     findPoints(db, () => client.close())
//
// });

const getPoints = callback => {
    MongoClient.connect(url, function(err, client) {
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        // var coordinates = [
        //     {
        //         position: [32.0622202,34.77488549999998],
        //         type: 'safe'
        //     },
        //     {
        //         position: [32.0628413,34.77314239999998],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.06367270000001,34.77277200000003],
        //         type: 'ok'
        //     }, {
        //         position: [32.0630658,34.77509950000001],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0652763,34.77097320000007],
        //         type: 'safe'
        //     }, {
        //         position: [32.0623008,34.77226500000006],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0662971,34.771616100000074],
        //         type: 'ok'
        //     }, {
        //         position: [32.0651611,34.776832199999944],
        //         type: 'ok'
        //     }, {
        //         position: [32.06301620000001,34.77190589999998],
        //         type: 'safe'
        //     }, {
        //         position: [32.0645541,34.772609800000055],
        //         type: 'ok'
        //     }, {
        //         position: [32.0665213,34.77026799999999],
        //         type: 'safe'
        //     }, {
        //         position: [32.0648737,34.77224890000002],
        //         type: 'ok'
        //     }, {
        //         position: [32.0640036,34.77409979999993],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0653263,34.77788959999998],
        //         type: 'ok'
        //     }, {
        //         position: [32.06557180000001,34.778560200000015],
        //         type: 'ok'
        //     }, {
        //         position: [32.06557180000001,34.778560200000015],
        //         type: 'safe'
        //     }, {
        //         position: [32.06810550000001,34.78236659999993],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0658731,34.77847840000004],
        //         type: 'safe'
        //     }, {
        //         position: [32.0663848,34.776454899999976],
        //         type: 'ok'
        //     }, {
        //         position: [32.0638792,34.77987800000005],
        //         type: 'ok'
        //     }, {
        //         position: [32.0660218,34.77490650000004],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0644581,34.77685329999997],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0642335,34.77483749999999],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0638547,34.773504600000024],
        //         type: 'safe'
        //     }, {
        //         position: [32.0629814,34.776482999999985],
        //         type: 'safe'
        //     }, {
        //         position: [32.0648235,34.769768200000044],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0644352,34.77188709999996],
        //         type: 'safe'
        //     }, {
        //         position: [32.0634156,34.77213810000001],
        //         type: 'unsafe'
        //     }, {
        //         position: [32.0659877,34.77548100000001],
        //         type: 'ok'
        //     }, {
        //         position: [32.0655783,34.775777999999946],
        //         type: 'safe'
        //     },  {
        //         position: [32.0644223,34.77601379999999],
        //         type: 'ok'
        //     }, {
        //         position: [32.0644223,34.77601379999999],
        //         type: 'ok'
        //     }, {
        //         position: [32.0650006,34.77775500000007],
        //         type: 'safe'
        //     }, {
        //         position: [32.0641166,34.77255790000004],
        //         type: 'safe'
        //     }, {
        //         position: [32.0637219,34.771356800000035],
        //         type: 'safe'
        //     }, {
        //
        //         position: [32.0648007,34.77117499999997],
        //         type: 'safe'
        //     }, {
        //         position: [32.0631476,34.77386899999999],
        //         type: 'ok'
        //     },
        //
        // ];
        // coordinates.forEach((data, index) => insertDocuments(db, data.position, data.type, () => {
        //     if (index < coordinates.length - 1){
        //         return console.log("insert" + data )
        //     }
        //     client.close();
        // }));

        findPoints(db, points => {
            callback(points);
            client.close()
        })

    });
}

module.exports = {
    getPoints
};
