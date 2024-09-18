import express from 'express';
import cors from 'cors';
import axios from 'axios';
import xml2js from 'xml2js';
import fs from 'fs';
import path from 'path';
import { polygon } from '@turf/turf'; 

const kmlFilePath = path.resolve('./data/asset.kml');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let polygons = [];

// Function to load and parse KML file

const loadKMLData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile(kmlFilePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            xml2js.parseString(data, (err, result) => {
                if (err) {
                    return reject(err);
                }
                try {
                    const placemarks = result.kml.Document[0].Placemark;
                    placemarks.forEach(place => {
                        const coordinates = place.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0].split(' ').map(coord => {
                            const [lng, lat] = coord.split(',').map(Number);
                            return [lng, lat];
                        });
                        polygons.push({
                            id: place.name[0],
                            polygon: polygon([coordinates]) 
                        });
                    });
                    resolve();
                } catch (parseError) {
                    reject(parseError);
                }
            });
        });
    });
};

// Start server after KML data is loaded
loadKMLData()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to load KML data:', err);
    });
