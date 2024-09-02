class Coord {
    constructor(long, lat, geo = "") {
        // makes sure its floats
        // also make sure always on the interval lat: -90;90 and long: -180;180
        // also rounds to 10e-6, equivalent to 1 dm
        this.long = Math.round(((parseFloat(long) + 180) % 360 - 180) * 1000000) / 1000000;
        this.lat = Math.round(((parseFloat(lat) + 90) % 180 - 90) * 1000000) / 1000000;
        this.geo = geo
    }
}

// returns an array of a square grid [num*num] of Coords centered around origin; sidelength is in m
function createGrid(_sideLength, num, center) {
    let grid = [];
    const R = 6371e3; // Earth's radius in meters
    let halfSide = _sideLength / 2; // Half of the grid's side length in meters

    // Calculate the latitude and longitude offset from the origin to the top-left corner
    let dLat = (halfSide / R) * (180 / Math.PI); // Offset in latitude degrees
    let dLong = (halfSide / (R * Math.cos(center.lat * Math.PI / 180))) * (180 / Math.PI); // Offset in longitude degrees

    // Starting latitude and longitude (top-left corner)
    let startLat = center.lat + dLat;
    let startLong = center.long - dLong;

    // Calculate the step size between points in the grid
    let latStep = (2 * dLat) / (num - 1);
    let longStep = (2 * dLong) / (num - 1);


    // Generate the grid
    for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
            grid[i * num + j] = new Coord(startLong + j * longStep, startLat - i * latStep);
        }
    }

    return grid;
}


//creates rating from an array of importances of values 0-1, and array of distances, later used for individual sources
function createSourceRating(_distances, maxdistance = 5000, wantArray = false,) {
    let _ratings = []
    for (let i = 0; i < _distances.length; i++) {
        importances[i] = 1;
    }


    _distances.forEach((distance, i) => {
        // returns a rating in whole percents
        _ratings[i] = Math.round(mapRange(distance, 0, maxdistance, 1, 0) * importances[i] / sumArray(importances) * 100)
    })

    return wantArray ? _ratings : sumArray(_ratings); //return either array of individual ratings or the rating
}


// maps number from range to another range, output is capped to outMax
const mapRange = (num, inMin, inMax, outMin, outMax) => num >= inMax ? outMax : (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

// sums all the numbers in an array
function sumArray(array) {
    let result = 0
    array.forEach(element => {
        result += element;
    })
    return result;
}

function lerpColor(value, color1 = "000000", color2 = "FFFFFF") {
    value = Math.max(0, Math.min(100, value)) / 100;

    const hexToRgb = (hex) => ({
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16)
    });

    const rgbToHex = ({ r, g, b }) =>
        `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

    const lerp = (start, end, t) => Math.round(start + t * (end - start));

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    return rgbToHex({
        r: lerp(rgb1.r, rgb2.r, value),
        g: lerp(rgb1.g, rgb2.g, value),
        b: lerp(rgb1.b, rgb2.b, value)
    });
}


function createSquare(_center, _sideLength, options = {}) {
    // Define the square's corners
    const gridCorners = createGrid(_sideLength, 2, _center).map(e => [e.lat, e.long])
    const squareCorners = [gridCorners[0], gridCorners[1], gridCorners[3], gridCorners[2]]

    // Create a polygon in the shape of a square with provided options
    return L.polygon(squareCorners, {
        color: options.color || 'blue',
        fillColor: options.fillColor || options.color || 'blue',
        fillOpacity: options.fillOpacity !== undefined ? options.fillOpacity : 1.0,
        stroke: false,
    }).addTo(map);
}