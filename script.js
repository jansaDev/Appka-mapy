// coords is an array of arrays
let POIs = [];
let origin;

let sources = []
let importances = []
let distances = [] //array[sources] of arrays[POIs] - distances from every source
let ratings = []

let APIdata

let sidelenght = 10000
let res = 10

async function doEverything() {
    await collectInputs()
    await getDistances()
    getRatings()
    showOnMap()
}



// fills the POIs and origin
async function collectInputs() {
    let POIinputs;

    // check if the geosearch origin input is empty
    let GeoInput = document.getElementById("geoSearch").value
    if (GeoInput) {
        // if there is input get the coords from geocoding
        let a = await fetch(`https://geocode.maps.co/search?q=${GeoInput}&api_key=6695595f3ffe2601568820kwz193465`)
        let b = await a.json()
        origin = new Coord(b[0].lon, b[0].lat)
        console.log(origin)

    }
    else {
        // if theres no input, use the manual coord input
        origin = new Coord(document.getElementById("Olong").value,
            document.getElementById("Olat").value);

    }


    // get the inputs
    POIinputs = document.getElementsByClassName('POI');
    // extract values and mapRange them onto the coords array
    for (let index = 0; index < POIinputs.length; index += 2) {
        POIs[index / 2] = new Coord(POIinputs[index].value, POIinputs[index + 1].value)
    }
}


// assignes the distances and sources array
async function getDistances() {
    console.log("waiting for a response...")


    sources = createGrid(sidelenght, res)

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


    // console.log(apiStringCoords, apiStringSources, apiStringDestinations)
    // fetch distances and extract distances
    let a = await fetch(`https://router.project-osrm.org/table/v1/car/${apiStringCoords}?sources=${apiStringSources}&destinations=${apiStringDestinations}&annotations=distance`);
    APIdata = await a.json();
    distances = await APIdata.distances;
    // console.log(APIdata)



    console.log("got it!")
}


function getRatings() {
    distances.forEach((e, i) => {
        ratings[i] = createSourceRating(e)
    })

    let MaxRatingIndex = ratings.indexOf(Math.max(...ratings));

    console.log("Nejlepší je source", (MaxRatingIndex + 1), ", v ulici " + APIdata.sources[MaxRatingIndex].name);
    console.table(distances)
    console.table(ratings)
}


