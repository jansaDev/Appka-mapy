// coords is an array of arrays
let POIs = [];
let origin;

let sources = []
let importances = []
let distances = [] //array[sources] of arrays[POIs] - distances from every source
let ratings = []
let listings = []
let APIdata

let sidelength = 5000
let res = 10;
let resLabel = document.getElementById("resLabel")
document.querySelector("#res").addEventListener("input", (event) => {
    res = event.target.value
    resLabel.innerText = "Resolution: " + res + " × " + res;
});

async function doEverything() {
    await collectInputs()
    await getDistances()
    await getRatings()
    await showOnMap()
}



// fills the POIs and origin
async function collectInputs() {
    // assign the origin object per the inputs
    origin = new Coord(document.getElementById("Olong").value,
        document.getElementById("Olat").value,
        document.getElementById("originGeoSearch").value);

    // if there is a geo, give it priority, rewrite the long, lat
    if (origin.geo) {
        let a = await fetch(`https://nominatim.openstreetmap.org/search?q=${origin.geo}&format=jsonv2`)
        let b = await a.json()

        origin = new Coord(b[0].lon, b[0].lat, origin.geo)

        // assign the input fields to the new coords
        document.getElementById("Olat").value = b[0].lat;
        document.getElementById("Olong").value = b[0].lon;
    }




    let numPOI = document.querySelectorAll(".POIGeoSearch").length;
    for (let i = 0; i < numPOI; i++) {
        let long, lat;
        let geo = document.querySelectorAll(".POIGeoSearch")[i].value

        if (geo) {
            let a = await fetch(`https://nominatim.openstreetmap.org/search?q=${geo}&format=jsonv2`)
            let f = await a.json()

            long = f[0].lon
            lat = f[0].lat

        } else {
            lat = document.querySelectorAll('.POI')[i * 2 + 1].value
            long = document.querySelectorAll('.POI')[i * 2].value
        }

        POIs[i] = new Coord(long, lat, geo);

    }
}


// assignes the distances and sources array
async function getDistances() {
    distances = []
    sources = []
    console.log("waiting for a response...")


    sources = createGrid(sidelength, res, origin)
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
    // console.log(`https://router.project-osrm.org/table/v1/car/${apiStringCoords}?sources=${apiStringSources}&destinations=${apiStringDestinations}&annotations=distance`)
    APIdata = await a.json();
    distances = await APIdata.distances;
    // console.log(APIdata)



    console.log("got it!")
}


async function getRatings() {
    ratings = []
    distances.forEach((e, i) => {
        ratings[i] = createSourceRating(e)
    })

    let MaxRatingIndex = ratings.indexOf(Math.max(...ratings));
    MaxRatingIndex ?
        console.log("Nejlepší je source", (MaxRatingIndex + 1), ", v ulici " + APIdata.sources[MaxRatingIndex].name)
        : console.log("všechny source jsou nula")

    await getListings(sources[MaxRatingIndex]);

    if (document.getElementById("consoleTable").checked) {
        let consoletable = []
        ratings.forEach((e, i) => {
            consoletable[i] = { rating: e, ...distances[i] }
        })
        console.table(consoletable)
    }
}


async function getListings(_coord) {
    listings = []
    let listingsJSON = [];
    const url = `https://zillow-com1.p.rapidapi.com/propertyByCoordinates?long=${_coord.long}&lat=${_coord.lat}&d=0.5&includeSold=false`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '26577d8115msh0ae0b65fa91053dp197647jsn84f73726c8f6',
            'x-rapidapi-host': 'zillow-com1.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        listingsJSON = await response.json();
        if (Object.keys(listingsJSON).length === 0) {
            listingsJSON = new Array()
            console.log("NO LISTINGS")

        }
        await listingsJSON.forEach((e, i) => {
            listings[i] = new Coord(e.property.longitude, e.property.latitude)
        })
        // console.log(listingsJSON);
    } catch (error) {
        console.error(error);
    }

}

