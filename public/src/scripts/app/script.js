import { AnimalIcon } from "./assets/markerIcons.js";

let map;
let userMarker;
let markers = [];
const THRESHOLD = 0.0001;
const socket = io('https://buscapet-production.up.railway.app');

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


        checkingPopupPane();
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



function checkingPopupPane(){
    const popupPane = document.querySelector('.leaflet-popup-pane');

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                if (mutation.addedNodes.length > 0) {
                    const popupWrapper = document.querySelectorAll('.leaflet-popup-content');
                    popupWrapper.forEach(popup =>{
                        popup.style.width = '100%';
                    })
                }
            }
        }
    });

        const config = { childList: true };

        observer.observe(popupPane, config);
}



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

function addMarkerFromCurrentLocation(markName, markDescription, markComment, animalButton) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userPosition = [position.coords.latitude, position.coords.longitude];
                const animalIcon = new AnimalIcon();

                const marker = L.marker(userPosition, {
                    icon: animalIcon.customIcon,
                    title: 'Sua Localização'
                }).addTo(map);

                // conteúdo do popup
                const popupContent = `
                <div class='left-column-profile'>
                    <div class='profile-picture-content'>
                        <div class='profile-picture-frame'>
                            <img src="./src/images/background_asset/mark_popup_left_paint.png">
                        </div>
                        <div class='profile-picture-wrapper'>
                            <img src=${animalIcon.markPhoto.src} style='width: 12em; aspect-ratio: 1;'>
                            <div class='chosen-animal-content'>
                                <div class='icon-content'>
                                    ${animalButton.childNodes[1].childNodes[1].childNodes[0].outerHTML}
                                </div>
                                <div class='text-content'>
                                    <p>${animalButton.childNodes[1].childNodes[3].childNodes[1].textContent}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='right-column-information'>
                    <div class='animal-text-content'>
                        <div class='title-wrapper'>
                            <p style='color:${getComputedStyle(markName).color}'>${markName.textContent}</p>
                        </div>
                        <div class='description-wrapper'>
                            <p>${markDescription}</p>
                        </div>
                        <div class='comment-wrapper'>
                            <div class='frame-container'>
                                <div class='frame-title'>
                                    <p>Comentário</p>
                                </div>
                                <div class='frame-border'>
                                    <p>${markComment}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                `

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

                const popupWrapper = document.querySelectorAll('.leaflet-popup-content');

                popupWrapper.forEach(popup =>{
                    popup.style.width = '100%';
                });
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
    //const markNameInput = document.querySelector('.input-pet-name');
    const animalButton = document.querySelector('.choose-animal-button');
    const colorDropdownButton = document.querySelector('.choose-color-button');
    const markDescriptionInput = document.querySelector('.input-pet-description');
    const markCommentInput = document.querySelector('.input-extra-description');

    addMarkerFromCurrentLocation(colorDropdownButton, markDescriptionInput.value, markCommentInput.value, animalButton);

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
