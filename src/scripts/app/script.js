let map;
let userMarker;
let markers = [];
const THRESHOLD = 0.0001;

const sketchMarkColor = document.querySelector('.sketch-mark-color');
const colorFill = sketchMarkColor ? sketchMarkColor.style.fill || '#FF0000' : '#FF0000';
const customMark = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 1 23.6 24" fill="none">
        <path class="sketch-mark-color" id="vector (Stroke)" fill:${colorFill} fill-rule="evenodd" clip-rule="evenodd" d="M8.9461 21.1315L8.89129 21.0787L8.89035 21.0778C8.81273 21.0023 8.73386 20.9254 8.65394 20.8471C7.2824 19.5029 5.57222 17.7231 4.34999 15.6268C3.12314 13.5227 2.35382 11.04 2.96276 8.32592C5.09133 -1.11519 18.9197 -1.10413 21.0372 8.33595C21.6639 11.1292 20.831 13.6741 19.5403 15.8149C18.2545 17.9477 16.4747 19.7455 15.0992 21.0783C14.0956 22.0555 13.1259 22.7323 12.0296 22.7449C10.9283 22.7576 9.95462 22.098 8.95039 21.1357L8.9461 21.1315Z" />
        <path id="ellipse (Stroke)" fill-rule="evenodd" clip-rule="evenodd" d="M8.75 9.5C8.75 7.70507 10.2051 6.25 12 6.25C13.7949 6.25 15.25 7.70507 15.25 9.5C15.25 11.2949 13.7949 12.75 12 12.75C10.2051 12.75 8.75 11.2949 8.75 9.5Z"/>
    </svg>
`);

function isPositionNearExistingMarker(position, threshold = THRESHOLD) {
    return markers.some(marker => {
        const markerPosition = marker.getLatLng();
        return Math.abs(position.lat - markerPosition.lat) < threshold &&
               Math.abs(position.lng - markerPosition.lng) < threshold;
    });
}

function initializeMap() {
    map = L.map('map').setView([-8.063245261243702, -34.87105100479096], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    userMarker = L.marker([51.505, -0.09], {icon: L.icon({
        iconUrl: './src/images/icons/gps2.png',
        iconSize: [30, 30],
        iconAnchor: [10, 10],
        popupAnchor: [1, 1],
        //shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
        //shadowSize: [41, 41]
    }), title: 'Sua localização'}).addTo(map);
    
    trackUserLocation();

    map.on('click', function(e) {
        const position = e.latlng;

        if (!isPositionNearExistingMarker(position)) {
            const marker = L.marker(position, { title: 'New Marker' }).addTo(map);
            markers.push(marker);
        }
    });
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
                            popupAnchor: [1, 1],
                            //shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
                            //shadowSize: [41, 41]
                        }),
                        title: 'Sua localização'
                    }).addTo(map);

                    map.setView(userPosition, 17);
                }
                
                //Gambiarra para ajeitar depois
                while(i){
                    map.setView(userPosition, 17);
                    i = false;
                }

                setInterval(() => {

                    map.setView(userPosition);

                }, 60000)

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
                
                const sketchMarkColor = document.querySelector('.sketch-mark-color');
                const colorFill = sketchMarkColor ? sketchMarkColor.style.fill || '#FF0000' : '#FF0000';

                const customMark = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 1 23.6 24" fill="none">
                        <path fill="${colorFill}" fill-rule="evenodd" clip-rule="evenodd" d="M8.9461 21.1315L8.89129 21.0787L8.89035 21.0778C8.81273 21.0023 8.73386 20.9254 8.65394 20.8471C7.2824 19.5029 5.57222 17.7231 4.34999 15.6268C3.12314 13.5227 2.35382 11.04 2.96276 8.32592C5.09133 -1.11519 18.9197 -1.10413 21.0372 8.33595C21.6639 11.1292 20.831 13.6741 19.5403 15.8149C18.2545 17.9477 16.4747 19.7455 15.0992 21.0783C14.0956 22.0555 13.1259 22.7323 12.0296 22.7449C10.9283 22.7576 9.95462 22.098 8.95039 21.1357L8.9461 21.1315Z" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 9.5C8.75 7.70507 10.2051 6.25 12 6.25C13.7949 6.25 15.25 7.70507 15.25 9.5C15.25 11.2949 13.7949 12.75 12 12.75C10.2051 12.75 8.75 11.2949 8.75 9.5Z"/>
                    </svg>
                `);

                const markCanvas = document.getElementById('mark-canvas');
                const markPhoto = document.getElementById('mark-photo');
                const canvas = document.getElementById('canvas');

                const context = markCanvas.getContext('2d');

                const size = Math.min(canvas.width, canvas.height);
                markCanvas.width = size;
                markCanvas.height = size;
                
                context.drawImage(canvas, 0, 0, size, size);
                
                const circularCanvas = document.createElement('canvas');
                circularCanvas.width = size;
                circularCanvas.height = size;
                const circularContext = circularCanvas.getContext('2d');
                
                circularContext.beginPath();
                const radius = size / 2 * 0.9;
                circularContext.arc(size / 2, size / 2, radius, 0, Math.PI * 2);
                circularContext.closePath();
                circularContext.clip();
                
                circularContext.drawImage(markCanvas, 0, 0, size, size);

                markPhoto.src = circularCanvas.toDataURL('image/png');
                markPhoto.style.display = 'none';

                const customIcon = L.icon({
                    iconUrl: markPhoto.src,
                    iconSize: [48, 48],
                    iconAnchor: [12, 40],
                    popupAnchor: [0, -32],
                    shadowUrl: customMark, 
                    shadowSize: [64, 64], 
                    shadowAnchor: [20.5, 41]
                });

                const marker = L.marker(userPosition, {
                    icon: customIcon, 
                    title: 'Sua Localização'
                }).addTo(map);
                markers.push(marker);
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

function test(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userPosition = [position.coords.latitude, position.coords.longitude];

                map.setView(userPosition, 17);


                console.log('Encontrado!')
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

initializeMap();