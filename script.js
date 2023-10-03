const url = "http://api.open-notify.org/iss-now.json";

// FR: fait une requette GET à une API
// EN: makes a GET request to an API
function appelleAPI(url) {
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau');
            }
            return response.json();
        })
        .catch(error => {
            //console.error('Erreur :', error);
            throw error;
        });
}



// FR: définie la position initial sur la carte
// EN: defines the initial position on the map
const map = L.map('map').setView([0, 0], 2);
map.on('click', function(event) {
    map.clicked = map.clicked + 1;
    setTimeout(function() {
        if (map.clicked == 1) {
            map.clicked = 0;
        }
    }, 300);
});
map.on('dblclick', function(event) {
    map.clicked = 0;
    map.zoomIn();
});

// FR: initialisation la carte en ajoutant une couchhe de tuile
// EN: initialize the map by adding a tile layer
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 14, // la valeur maximum permetant de zoomé
    minZoom: 1, // la valeur minimum permetant de zoomé
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>' // copyright
}).addTo(map);


// FR: initialisation d'une icone marker personnalisé
// EN: initializing a custom marker icon
const LeafIcon = L.Icon.extend({
    options: {
        // FR: taille de l'icône
        // FR: size of the icon
        iconSize: [81, 32],

        // FR: point de l'icône qui correspondra à l'emplacement du marqueur
        // EN: point of the icon which will correspond to marker's location
        iconAnchor: [0, 0],

        // FR: point à partir duquel la fenêtre popup doit s'ouvrir par rapport à l'iconAnchor
        // FR: point from which the popup should open relative to the iconAnchor
        popupAnchor: [50, 0],
    }
});


const station = new LeafIcon({
    iconUrl: "./image/station.png"
});

// a layer group, used here like a container for markers
var markersGroup = L.layerGroup();
map.addLayer(markersGroup);


appelleAPI(url)
    .then(donnee => {
        const marker = L.marker([donnee.iss_position.longitude, donnee.iss_position.latitude], { icon: station }).addTo(map)
            .bindPopup(donnee.iss_position.longitude + " , " + donnee.iss_position.latitude).openPopup();
        console.log(donnee.iss_position.longitude + " , " + donnee.iss_position.latitude)

        map.on('click', function(e) {
            var marker = L.marker(e.latlng).addTo(markersGroup)
                .bindPopup("distance: " + (donnee.iss_position.longitude - e.latlng[0]).toString() + ", " + (donnee.iss_position.latitude - e.latlng[1]).toString()).openPopup();
            return;
        });
    })
    .catch(error => {
        console.error('Erreur :', error);
    });