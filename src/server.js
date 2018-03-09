const _ = require('lodash');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const Database = require('./database');
const Bot = require('./bot');

app.use(express.static('public'));
app.use( bodyParser.json() );
app.set('view engine', 'pug');

app.get('/issafe', (req, res) => {
    res.json({ message: "No! this is not a safe area! Run Forest Run!!!" });
});

app.post('/mark-location', (req, res) => {
    console.log(req.body);
    res.json({ message: "No! this is not a safe area! Run Forest Run!!!" });
});

app.get('/', (req, res) => {
    const { latitude, longitude } = req.query;
    const position = { latitude: latitude || 32.066152, longitude: longitude || 34.774939 };

    const mapPoints = points => {
        return points.map(point => ({
            position: point.location.coordinates,
            type: point.icon
        }));
    };

    const mapPolygons = polygons => {
        return polygons.map(polygon => ({
            paths: polygon.coordinates,
            color: polygon.color
        }));
    };

    const pointsCallback = pointsData => {
        const features = mapPoints(pointsData);
        const polygonsCallback = polygonsData => {
            const polygons = mapPolygons(polygonsData);
            res.render('index', { features: JSON.stringify(features), polygons: JSON.stringify(polygons), position: JSON.stringify(position) });
        };

        Database.getPolygons(polygonsCallback);
    };

    Database.getPoints(pointsCallback);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

