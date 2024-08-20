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


// initilize the map
var map = L.map('map', {
    zoomControl: false,
    zoomSnap: 0.1,
    zoomDelta: 1,
    wheelPxPerZoomLevel: 40,
    wheelDebounceTime: 20
}).setView([40.9359, -73.9951], 15);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);


// shows all the stuff on the map
let SourcesMarkers = []
let POIsMarkers = []
let OriginMarker;
let polygons = []
function showOnMap() {
    OriginMarker = L.marker([origin.lat, origin.long], { icon: yellowIcon }).addTo(map)
        .bindPopup("origin");

    sources.forEach((element, i) => {
        // if there already is marker, delete it
        if (SourcesMarkers[i] != undefined) {
            map.removeLayer(SourcesMarkers[i]);
            map.removeLayer(polygons[i]);
        };

        // create a marker at the coords and bind a popup
        // SourcesMarkers[i] = L.marker([element.lat, element.long], { icon: greenIcon }).addTo(map)
        //     .bindPopup(`<b>source ${i + 1}</b><br>rating: ${ratings[i]}`)

        // create a circle around the marker
        polygons[i] = L.circle([element.lat, element.long], {
            color: 'green',
            fillOpacity: ratings[i] / 100,
            radius: sidelenght / (res - 1) / 2,
            stroke: false
        }).addTo(map);
    })

    POIs.forEach((element, i) => {
        // if there already is marker, delete it
        if (POIsMarkers[i] != undefined) {
            map.removeLayer(POIsMarkers[i]);
        };

        // create a marker at the coords and bind a popup
        POIsMarkers[i] = L.marker([element.lat, element.long], { icon: redIcon }).addTo(map)
            .bindPopup(`POI ${i + 1}`);
    })
}

