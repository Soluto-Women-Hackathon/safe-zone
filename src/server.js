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

app.get('/', (req, res) => {
    const mapPoints = points => {
        return points.map(point => ({
            position: point.location.coordinates,
            type: point.icon
        }));
    }

    const renderPoints = points => {
        const features = mapPoints(points);
        res.render('index', { features: JSON.stringify(features) });
    };

    Database.getPoints(renderPoints);
});

// app.get('/', (req, res) => res.send('Hello World!'));

app.listen(3000, () => console.log('Example app listening on port 3000!'));

