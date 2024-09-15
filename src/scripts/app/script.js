let map;
let userMarker;
let markers = [];
const THRESHOLD = 0.0001;

function isPositionNearExistingMarker(position, threshold = THRESHOLD) {
    return markers.some(marker => {
        const markerPosition = marker.getLatLng();
        return Math.abs(position.lat - markerPosition.lat) < threshold &&
               Math.abs(position.lng - markerPosition.lng) < threshold;
    });
}

function initializeMap() {
    map = L.map('map').setView([-8.063245261243702, -34.87105100479096], 12); // Centraliza o mapa em uma posição inicial

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Adiciona um marcador inicial
    userMarker = L.marker([51.505, -0.09], {icon: L.icon({
        iconUrl: './src/images/icons/gps2.png',
        iconSize: [30, 30],
        iconAnchor: [10, 10],
        popupAnchor: [1, 1],
        //shadowUrl: 'https://unpkg.com/leaflet/dist/images/marker-shadow.png',
        //shadowSize: [41, 41]
    }), title: 'Sua localização'}).addTo(map);
    

    // Função para rastrear a localização do usuário
    trackUserLocation();

    // Adiciona um evento de clique no mapa para adicionar marcadores
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

                // Se o marcador já existe, apenas atualiza sua posição
                if (userMarker) {
                    userMarker.setLatLng(userPosition);
                } else {
                    // Caso contrário, cria um novo marcador para a posição atual
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
                    // Centraliza o mapa na nova posição do usuário
                    map.setView(userPosition);

                }, 60000)

            },
            (error) => {
                handleLocationError(true, map.getCenter(), error.message);
            },
            {
                enableHighAccuracy: true, // Tentar obter localização com alta precisão
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

                if (!isPositionNearExistingMarker(userPosition)) {
                    const marker = L.marker(
                        userPosition, 
                        {title: 'Sua Localização' }

                    ).addTo(map);
                    markers.push(marker);
                    map.setView(userPosition);
                } else {
                    alert('A marker already exists near your location.');
                }
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