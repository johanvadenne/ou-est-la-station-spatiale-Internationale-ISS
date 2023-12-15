const url = "http://api.open-notify.org/iss-now.json";
const libelleMarker = ["Gagner!","Boilland","Très Chaud","Chaud","Pas Loin","Froid","Geler","Congeler"]
const chaudFroid = {
    longitude: {
        gagner: {
            distance: 0.1,
            niveau: 1
        },
        boilland: {
            distance: 5,
            niveau: 2
        },
        tresChaud: {
            distance: 10,
            niveau: 3
        },
        chaud: {
            distance: 25,
            niveau: 4
        },
        pasLoin: {
            distance: 50,
            niveau: 5
        },
        froid: {
            distance: 80,
            niveau: 6
        },
        geler: {
            distance: 120,
            niveau: 7
        },
        congeler: {
            distance: 180,
            niveau: 8
        }
    },
    latitude: {
        gagner: {
            distance: 0.05,
            niveau: 1
        },
        boilland: {
            distance: 2.5,
            niveau: 2
        },
        tresChaud: {
            distance: 5,
            niveau: 3
        },
        chaud: {
            distance: 12.5,
            niveau: 4
        },
        pasLoin: {
            distance: 25,
            niveau: 5
        },
        froid: {
            distance: 40,
            niveau: 6
        },
        geler: {
            distance: 60,
            niveau: 7
        },
        congeler: {
            distance: 90,
            niveau: 8
        }
    }
}

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
const stationSpatial = L.Icon.extend({
    options: {
        // FR: taille de l'icône
        // EN: size of the icon
        iconSize: [81, 32],

        // FR: point de l'icône qui correspondra à l'emplacement du marqueur
        // EN: point of the icon which will correspond to marker's location
        iconAnchor: [0, 0],

        // FR: point à partir duquel la fenêtre popup doit s'ouvrir par rapport à l'iconAnchor
        // EN: point from which the popup should open relative to the iconAnchor
        popupAnchor: [50, 0],
    }
});


// FR: initialisation d'une icone marker personnalisé
// EN: initializing a custom marker icon
const mark = L.Icon.extend({
    options: {
        iconSize:     [25, 40],
        shadowSize:   [50, 64],
        iconAnchor:   [10, 40],
        popupAnchor: [3, -40],
    }
});

const station = new stationSpatial({
    iconUrl: "./image/station.png"
});

// a layer group, used here like a container for markers
var markersGroup = L.layerGroup();
map.addLayer(markersGroup);


appelleAPI(url)
    .then(donnee => {
        const marker = L.marker([donnee.iss_position.latitude, donnee.iss_position.longitude], { icon: station }).addTo(map)
            .bindPopup(donnee.iss_position.longitude + " , " + donnee.iss_position.latitude).openPopup();

        console.log(donnee.iss_position.longitude + " , " + donnee.iss_position.latitude)

        map.on('click', function(e) {
            let longitude = donnee.iss_position.longitude - e.latlng.lng;
            var latitude = donnee.iss_position.latitude - e.latlng.lat;
            var niv1 = -1;
            var niv2 = -1;
            var lib = "";
            var derniereDistance = 0;

            for (const prop in chaudFroid.longitude) {
                if (chaudFroid.longitude.hasOwnProperty(prop)) {
                    const lieu = chaudFroid.longitude[prop];
                    if (Math.abs(longitude) <= lieu.distance) {
                        console.log(longitude, lieu.distance)
                        niv1 = lieu.niveau;
                        break;
                    }
                }
            }

            for (const prop in chaudFroid.latitude) {
                if (chaudFroid.latitude.hasOwnProperty(prop)) {
                    const lieu = chaudFroid.latitude[prop];
                    if (Math.abs(latitude) <= lieu.distance) {
                        console.log(latitude, lieu.distance)
                        niv2 = lieu.niveau;
                        break;
                    }
                }
            }

            if (niv1 == -1 || niv2 == -1) {
                lib = "BRRRRR!!!";
                niv = 9;
            }
            else {
                niv = Math.floor((niv1+niv2)/2);
                lib = libelleMarker[niv-1];
            }

            if (lib == "Gagner!") {
                
            }

            // FR: créer le marker
            // EN: create marker
            const markerIcon = new mark({
                iconUrl: "./assets/image/marker-icon" + niv + ".png"
            });

            console.log(e.latlng.lng    + " , " + e.latlng.lat)
            console.log(longitude + " , " + latitude)
            var marker = L.marker(e.latlng, { icon: markerIcon }).addTo(markersGroup)
                .bindPopup(lib).openPopup();
            return;
        });
    })
    .catch(error => {
        console.error('Erreur :', error);
    });