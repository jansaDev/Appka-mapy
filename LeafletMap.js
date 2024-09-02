const greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const yellowIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [20, 30],
    iconAnchor: [10, 30],
    popupAnchor: [1, -34],
    shadowSize: [30, 30]
});


// initilize the map
var map = L.map('map', {
    zoomControl: false,
    zoomSnap: 0.1,
    zoomDelta: 1,
    wheelPxPerZoomLevel: 40,
    wheelDebounceTime: 20
}).setView([40.9359, -73.9951], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// shows all the stuff on the map
let SourcesMarkers = []
let POIsMarkers = []
let OriginMarker;
let sourcePolygons = []
async function showOnMap() {
    // jump the map to origin
    map.panTo([origin.lat, origin.long])
    // ORIGIN
    if (OriginMarker) { map.removeLayer(OriginMarker) }

    OriginMarker = L.marker([origin.lat, origin.long], { icon: yellowIcon }).addTo(map).bindPopup("origin");

    // HEATMAP

    // delete all the existing polygons
    sourcePolygons.forEach((e, i) => {
        if (sourcePolygons[i]) {
            map.removeLayer(sourcePolygons[i]);
        };
    })

    // reset the polygons array
    sourcePolygons = []

    sources.forEach((element, i) => {
        // create a marker at the coords and bind a popup
        // SourcesMarkers[i] = L.marker([element.lat, element.long], { icon: greenIcon }).addTo(map)
        //     .bindPopup(`<b>source ${i + 1}</b><br>rating: ${ratings[i]}`)

        // create a square around the source
        sourcePolygons[i] = createSquare(element, sidelength / (res - 1), {
            color: lerpColor(ratings[i], "FF0000", "90EE90"),
            fillOpacity: 0.7
        })
        sourcePolygons[i].addTo(map);
    })

    // POIS
    POIs.forEach((element, i) => {
        // if there already is marker, delete it
        if (POIsMarkers[i]) {
            map.removeLayer(POIsMarkers[i]);
        };

        // create a marker at the coords and bind a popup
        POIsMarkers[i] = L.marker([element.lat, element.long], { icon: redIcon }).addTo(map)
            .bindPopup(`POI ${i + 1}`);
    })


    // LISTINGS
    listings.forEach((element, i) => {
        // if there already is marker, delete it
        // if (listings[i]) {
        //     map.removeLayer(POIsMlistingsarkers[i]);
        // };
        // create a marker at the coords and bind a popup
        L.marker([element.lat, element.long], { icon: blueIcon }).addTo(map)
    })

}

