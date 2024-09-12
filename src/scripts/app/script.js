let map;
let userMarker;
let infoWindow;
let markers = [];

function isPositionNearExistingMarker(position, threshold = 0.0001) {
  return markers.some(marker => {
    const markerPosition = marker.getPosition();
    return Math.abs(position.lat - markerPosition.lat()) < threshold &&
           Math.abs(position.lng - markerPosition.lng()) < threshold;
  });
}

function initMap(apiKey) {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initializeMap&v=weekly`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

function initializeMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: { lat: -25.344, lng: 131.031 },
        mapId: 'DEMO_MAP_ID',
    });

    infoWindow = new google.maps.InfoWindow();

    // Chama a função para rastrear a posição do usuário
    trackUserLocation();

    map.addListener('click', (event) => {
        const { latLng } = event;
        const position = {
          lat: latLng.lat(),
          lng: latLng.lng()
        };

        if (!isPositionNearExistingMarker(position)) {
          const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: 'New Marker'
          });
          markers.push(marker); 
        }
      });
}

function trackUserLocation() {
    if (navigator.geolocation) {
        // Solicitar a permissão de localização
        navigator.permissions.query({ name: 'geolocation' }).then(permission => {
            if (permission.state === 'denied') {
                alert('Permissão de localização negada. Ative nas configurações do navegador.');
                return;
            }

            // Usando `watchPosition` para monitorar continuamente a posição
            navigator.geolocation.watchPosition(
                (position) => {
                    const userPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    // Se o marcador já existe, apenas atualiza sua posição
                    if (userMarker) {
                        userMarker.setPosition(userPosition);
                    } else {
                        // Caso contrário, cria um novo marcador para a posição atual
                        userMarker = new google.maps.Marker({
                            position: userPosition,
                            map: map,
                            icon: {
                                path: google.maps.SymbolPath.CIRCLE,
                                scale: 7,  // Ajuste o tamanho da bolinha
                                fillColor: '#4285F4', // Azul padrão
                                fillOpacity: 1,
                                strokeColor: '#fff', // Borda branca
                                strokeWeight: 2
                            },
                            title: 'Sua localização'
                        });
                    }

                    // Centraliza o mapa na nova posição do usuário
                    map.setCenter(userPosition);

                },
                (error) => {
                    handleLocationError(true, map.getCenter(), error.message);
                },
                {
                    enableHighAccuracy: true, // Tentar obter localização com alta precisão
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        });
    } else {
        handleLocationError(false, map.getCenter());
    }
}

function addMarkerFromCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          if (!isPositionNearExistingMarker(userPosition)) {
            const marker = new google.maps.Marker({
              position: userPosition,
              map: map,
              title: 'Your Location'
            });
            markers.push(marker);
            map.setCenter(userPosition); 
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

function handleLocationError(browserHasGeolocation, pos, message = "Erro desconhecido") {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation
            ? `Erro: Não foi possível obter sua localização (${message}).`
            : "Erro: Seu navegador não suporta geolocalização."
    );
    infoWindow.open(map);
}

document.getElementById('apiKeyForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const apiKey = document.getElementById('apiKeyInput').value;
    if (apiKey) {
        initMap(apiKey);
    }
});
