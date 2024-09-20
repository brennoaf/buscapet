import { AnimalIcon } from "./assets/markerIcons.js";

let map;
let userMarker;
let markers = [];
const THRESHOLD = 0.0001;
const socket = io('http://127.0.0.1:3000');

socket.on('existingMarkers', (existingMarkers) => {
    existingMarkers.forEach(marker => {
        const position = L.latLng(marker.lat, marker.lng);
        const customIcon = L.icon({
            iconUrl: marker.iconUrl,
            iconSize: marker.iconSize,
            iconAnchor: marker.iconAnchor,
            popupAnchor: marker.popupAnchor,
            shadowUrl: marker.shadowUrl,
            shadowSize: marker.shadowSize,
            shadowAnchor: marker.shadowAnchor
        });

        const newMarker = L.marker(position, {
            icon: customIcon,
            title: 'Sua Localização'
        }).addTo(map);
        
        newMarker.bindPopup(marker.popupContent).openPopup();

        markers.push(newMarker);
    });
});


socket.on('newMarker', (markerData) => {
    const position = L.latLng(markerData.lat, markerData.lng);

    const customIcon = L.icon({
        iconUrl: markerData.iconUrl,
        iconSize: markerData.iconSize,
        iconAnchor: markerData.iconAnchor,
        popupAnchor: markerData.popupAnchor,
        shadowUrl: markerData.shadowUrl,
        shadowSize: markerData.shadowSize,
        shadowAnchor: markerData.shadowAnchor
    });

    const newMarker = L.marker(position, {
        icon: customIcon,
        title: 'Sua Localização'
    }).addTo(map);

    newMarker.bindPopup(markerData.popupContent).openPopup();

    markers.push(newMarker);
});

function initializeMap() {
    map = L.map('map').setView([-8.063245261243702, -34.87105100479096], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    userMarker = L.marker([51.505, -0.09], {
        icon: L.icon({
            iconUrl: './src/images/icons/gps2.png',
            iconSize: [30, 30],
            iconAnchor: [10, 10],
            popupAnchor: [1, 1]
        }),
        title: 'Sua localização'
    }).addTo(map);

    trackUserLocation();
    
}

function trackUserLocation() {
    let i = true;
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
            (position) => {
                const userPosition = [position.coords.latitude, position.coords.longitude];

                if (userMarker) {
                    userMarker.setLatLng(userPosition);
                } else {
                    userMarker = L.marker(userPosition, {
                        icon: L.icon({
                            iconUrl: './src/images/icons/gps2.png',
                            iconSize: [30, 30],
                            iconAnchor: [10, 10],
                            popupAnchor: [1, 1]
                        }),
                        title: 'Sua localização'
                    }).addTo(map);

                    map.setView(userPosition, 17);
                }

                while(i) {
                    map.setView(userPosition, 17);
                    i = false;
                }
            },
            (error) => {
                handleLocationError(true, map.getCenter(), error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 9000,
                maximumAge: 0
            }
        );
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function addMarkerFromCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userPosition = [position.coords.latitude, position.coords.longitude];
                const animalIcon = new AnimalIcon();

                const marker = L.marker(userPosition, {
                    icon: animalIcon.customIcon,
                    title: 'Sua Localização'
                }).addTo(map);

                // Define o conteúdo do popup
                const popupContent = `<b>Marcador Padrão!</b><br><img src=${animalIcon.markPhoto.src} style='width: 3em; aspect-ratio: 1;'>`;

                marker.bindPopup(popupContent).openPopup();

                markers.push(marker);

                socket.emit('addMarker', {
                    lat: userPosition[0],
                    lng: userPosition[1],
                    iconUrl: animalIcon.markPhoto.src,
                    iconSize: [48, 48],
                    iconAnchor: [15, 40],
                    popupAnchor: [0, -32],
                    shadowUrl: animalIcon.customMark,
                    shadowSize: [64, 64],
                    shadowAnchor: [23, 41],
                    popupContent: popupContent
                });

                map.setView(userPosition);
            },
            () => {
                alert('Unable to retrieve your location. Please check your browser\'s location permissions.');
            },
            { timeout: 10000 }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

const sendButton = document.querySelector('.send-button');

sendButton.addEventListener('click', () => {
    addMarkerFromCurrentLocation();
});

function handleLocationError(browserHasGeolocation, pos, message = "Unknown error") {
    L.popup()
        .setLatLng(pos)
        .setContent(
            browserHasGeolocation
                ? `Error: Unable to get your location (${message}).`
                : "Error: Your browser does not support geolocation."
        )
        .openOn(map);
}

initializeMap();
