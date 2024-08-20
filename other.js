class Coord {
    constructor(long, lat) {
        // makes sure its floats
        // also make sure always on the interval lat: -90;90 and long: -180;180
        // also rounds to 10e-6, equivalent to 1 dm
        this.long = Math.round(((parseFloat(long) + 180) % 360 - 180) * 1000000) / 1000000;
        this.lat = Math.round(((parseFloat(lat) + 90) % 180 - 90) * 1000000) / 1000000;
    }
}

// returns an array of a square grid [num*num] of Coords centered around origin; sidelenght is in metres
function createGrid(sidelenght = 1000, num = 3) {
    var grid = [];

    // spacings are in degrees so we need to convert from sidelenght in metres to spacings in degrees
    let spacingLat = sidelenght / 110574 / (num - 1);
    let spacingLong = sidelenght / 111320 / Math.cos(origin.lat * Math.PI / 180) / (num - 1);

    // first coord of the grid from which others are spaced
    let start = new Coord(origin.long - spacingLong * (num - 1) / 2, origin.lat + spacingLat * (num - 1) / 2)

    // creating the grid
    for (let i = 0; i < num; i++) {
        for (let j = 0; j < num; j++) {
            grid[i * num + j] = new Coord(start.long + j * spacingLong, start.lat - i * spacingLat)
        }
    }

    return grid
}


//creates rating from an array of importances of values 0-1, and array of distances, later used for individual sources
function createSourceRating(_distances, maxdistance = 10000, wantArray = false,) {
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