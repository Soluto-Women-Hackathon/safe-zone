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

const DEFAULT_LATITUDE = 32.066152;
const DEFAULT_LONGITUDE = 34.774939;

const mapLocationToInsert = markedLocation => {
    const { location, ...rest } = markedLocation;
    const { latitude, longitude } = location;

    return {
        location: {
            type: 'Point',
            coordinates: [latitude, longitude]
        },
        icon: 'pin',
        ...rest
    }
};

app.post('/mark-location', (req, res) => {
    try {
        const locationToInsert = mapLocationToInsert(req.body);
        Database.insertLocation(locationToInsert, id => {
            res.json({ message: "Thank you for updating", markedLocationId: id });
        })
    } catch (e) {
        res.json({});
    }
});

const getPosition = query => {
    const { latitude, longitude } = query;
    return { latitude: latitude || DEFAULT_LATITUDE, longitude: longitude || DEFAULT_LONGITUDE };
};

app.get('/', (req, res) => {
    const { pinId } = req.query;

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

    const locationCallBack = locationData => {
        let position;
        if (!locationData) {
            position = getPosition(req.query);
        } else {
            const coordinates = _.get(locationData, 'location.coordinates') || [DEFAULT_LATITUDE, DEFAULT_LONGITUDE];
            position = { latitude: coordinates[0], longitude: coordinates[1] };
        }

        const pointsCallback = pointsData => {
            const features = mapPoints(pointsData);
            const polygonsCallback = polygonsData => {
                const polygons = mapPolygons(polygonsData);
                res.render('index', {
                    features: JSON.stringify(features),
                    polygons: JSON.stringify(polygons),
                    position: JSON.stringify(position)
                });
            };

            Database.getPolygons(polygonsCallback);
        };

        Database.getPoints(pointsCallback);
    };

    Database.getLocation(pinId, locationCallBack);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));

