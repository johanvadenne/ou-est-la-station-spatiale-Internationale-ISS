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
// map.dragging.disable();
map.on('click', function(event){
    map.clicked = map.clicked + 1;
    setTimeout(function(){
        if(map.clicked == 1){           
            map.clicked = 0;
        }
     }, 300);
});
map.on('dblclick', function(event){
    map.clicked = 0;
    map.zoomIn();
});

// FR: initialisation la carte en ajoutant une couchhe de tuile
// EN: initialize the map by adding a tile layer
const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 2, // la valeur maximum permetant de zoomé
    minZoom: 2, // la valeur minimum permetant de zoomé
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
        iconAnchor : [0, 0],
        
        // FR: point à partir duquel la fenêtre popup doit s'ouvrir par rapport à l'iconAnchor
        // FR: point from which the popup should open relative to the iconAnchor
        popupAnchor: [10, -50],
    }
});


const station = new LeafIcon({
    iconUrl: "./image/station.png"
});


appelleAPI(url)
.then(donnee => {
    
    const marker = L.marker([donnee.iss_position.longitude, donnee.iss_position.latitude], { icon: station }).addTo(map)
    .bindPopup("test").openPopup();
    console.log(donnee.iss_position.longitude, donnee.iss_position.latitude)


const Tuile = L.Icon.extend({
    options: {
        // FR: taille de l'icône
        // FR: size of the icon
        iconSize: [30, 30],

        // FR: point de l'icône qui correspondra à l'emplacement du marqueur
        // EN: point of the icon which will correspond to marker's location
        iconAnchor : [0, 75],
        
        // FR: point à partir duquel la fenêtre popup doit s'ouvrir par rapport à l'iconAnchor
        // FR: point from which the popup should open relative to the iconAnchor
        popupAnchor: [10, -50],
    }
});

const carre = new Tuile({
    iconUrl: "./image/tuile.png"
});
const carre2 = new Tuile({
    iconUrl: "./image/tuile2.png"
});

let img;
let x = 0;
for (let i = -40; i < (180 / 9)*2; i++) {
    if (x >= donnee.iss_position.longitude - 50 && x <= donnee.iss_position.longitude + 50 && i*9 >= donnee.iss_position.latitude - 50 && i*9 <= donnee.iss_position.latitude + 50) {
        img = carre2
    }
    else {
        img = carre
    }
    const marker2 = L.marker([-90, i*9], { icon: img }).addTo(map)
    for (let j = 0; j < (90 / 1.3)*2; j++) {
        x = -90+j*1.3;
        if (x >= donnee.iss_position.longitude - 50 && x <= donnee.iss_position.longitude + 50 && i*9 >= donnee.iss_position.latitude - 50 && i*9 <= donnee.iss_position.latitude + 50) {
            img = carre2
        }
        else {
            img = carre
        }
        if ((x >= 75 && x <= 100) || (x <= -75 && x >= -100)) {
            const marker2 = L.marker([x, i*9], { icon: img }).addTo(map)
        }
    }
    for (let j = 0; j < (90 / 3.5)*2; j++) {
        x = -90+j*3.5;
        if (x >= donnee.iss_position.longitude - 50 && x <= donnee.iss_position.longitude + 50 && i*9 >= donnee.iss_position.latitude - 50 && i*9 <= donnee.iss_position.latitude + 50) {
            img = carre2
        }
        else {
            img = carre
        }
        if ((x >= 55 && x < 75) || (x <= -55 && x > -75)) {
            const marker2 = L.marker([x, i*9], { icon: img }).addTo(map)
        }
    }
    for (let j = 0; j < (90 / 7.5)*2; j++) {
        x = -90+j*7.5;
        if (x >= donnee.iss_position.longitude - 50 && x <= donnee.iss_position.longitude + 50 && i*9 >= donnee.iss_position.latitude - 50 && i*9 <= donnee.iss_position.latitude + 50) {
            img = carre2
        }
        else {
            img = carre
        }
        if ((x >= 0 && x < 55) || (x <= -0 && x > -55)) {
            const marker2 = L.marker([x, i*9], { icon: img }).addTo(map)
        }
    }
}
})
.catch(error => {
    console.error('Erreur :', error);
});