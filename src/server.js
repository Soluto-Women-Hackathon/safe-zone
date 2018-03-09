const _ = require('lodash');
const express = require('express');
const app = express();

const Database = require('./database');
const Bot = require('./bot');

app.use(express.static('public'));
app.set('view engine', 'pug');

let router = require('express').Router();

app.get('/shtuty', (req, res) => {
    res.render('shtuty', { pageTitle: 'Hey', youAreUsingJade: true, message: 'Hello there!', users: {} });
});

app.get('/issafe', (req, res) => {
    console.log(req);
    res.render('shtuty', { pageTitle: 'Hey', youAreUsingJade: true, message: 'Hello there!', users: {} });
});

app.get('/', (req, res) => {
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
            res.render('index', { features: JSON.stringify(features), polygons: JSON.stringify(polygons) });
        };

        Database.getPolygons(polygonsCallback);
    };

    Database.getPoints(pointsCallback);
});

// app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

