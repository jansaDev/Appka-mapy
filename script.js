// coords is an array of arrays
var POIs = [];
var origin;
var distances = [] //array[sources] of arrays[POIs] - distances from every source
var sources = []
var ratings = []

class Coord {
    constructor(long, lat) {
        // makes sure its floats
        // also make sure always on the interval lat: -90;90 and long: -180;180
        // also rounds to 10e-6, equivalent to 1 dm
        this.long = Math.round(((parseFloat(long) + 180) % 360 - 180) * 1000000) / 1000000;
        this.lat = Math.round(((parseFloat(lat) + 90) % 180 - 90) * 1000000) / 1000000;
    }
}


// fills the POIs and origin
function collectInputs() {
    let POIinputs;

    // get the inputs
    origin = new Coord(document.getElementById("Olong").value,
        document.getElementById("Olat").value);

    POIinputs = document.getElementsByClassName('POI');
    // extract values and mapRange them onto the coords array
    for (let index = 0; index < POIinputs.length; index += 2) {
        POIs[index / 2] = new Coord(POIinputs[index].value, POIinputs[index + 1].value)
    }
}


// assignes the distances and sources array
async function getDistances() {
    console.log("waiting for a response...")


    sources = createGrid(600, 4)

    // formatting the data for the OSRM routing matrix api, fucking hell
    let apiStringCoords = ""
    let apiStringSources = ""
    let apiStringDestinations = ""

    sources.forEach((element, index) => {
        apiStringCoords += element.long + "," + element.lat + ";"
        apiStringSources += index + ";"
    })

    POIs.forEach((element, index) => {
        apiStringCoords += element.long + "," + element.lat + ";"
        apiStringDestinations += (index + sources.length) + ";"
    })
    apiStringCoords = apiStringCoords.slice(0, -1)
    apiStringDestinations = apiStringDestinations.slice(0, -1)
    apiStringSources = apiStringSources.slice(0, -1)


    console.log(apiStringCoords, apiStringSources, apiStringDestinations)
    // fetch distances and extract distances
    let a = await fetch(`https://router.project-osrm.org/table/v1/car/${apiStringCoords}?sources=${apiStringSources}&destinations=${apiStringDestinations}&annotations=distance`);
    let b = await a.json();
    distances = await b.distances;



    console.log("got it!")
}


function getRatings() {
    distances.forEach((e, i) => {
        ratings[i] = createRating(e)
    })

    console.table(distances)
    console.table(ratings)
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


//creates rating from an array of importances of values 0-1, and array of distances
function createRating(_distances, maxdistance = 1000, wantArray = false, _importances = []) {
    let _ratings = []
    for (let i = 0; i < _distances.length; i++) {
        _importances[i] = 1;
    }


    _distances.forEach((distance, i) => {
        // returns a rating in whole percents
        _ratings[i] = Math.round(mapRange(distance, 0, maxdistance, 1, 0) * _importances[i] / sumArray(_importances) * 100)
    })

    return wantArray ? _ratings : sumArray(_ratings); //return either array of ratings or the rating{}
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


// function to purely display the data
function loadTableData(array) {
    const table = document.getElementById("testBody");
    array.forEach(item => {
        let row = table.insertRow();
        item.forEach
        let col = row.insertCell(0);
        col.innerHTML = item;
    });
}