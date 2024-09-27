import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as L from 'leaflet';
import { io, Socket } from 'socket.io-client';
import { AnimalIcon } from './assets/animal-icon';
import { PopupContentComponent } from './components/popup-content/popup-content.component';
import { FloatButtonsComponent } from './components/float-buttons/float-buttons.component';
import { TakePicture } from './components/popup-content/services/takePhoto';

@Component({
  selector: 'app-main-app',
  templateUrl: './main-app.component.html',
  styleUrls: ['./main-app.component.scss', './assets/styles/markPopup/popup.scss']
})
export class MainAppComponent implements AfterViewInit {
  @ViewChild('blurBackground') blurBackground!: HTMLDivElement;
  @ViewChild(FloatButtonsComponent) floatButtonsComponent!: FloatButtonsComponent;
  @ViewChild('popupContent') popupContent!: ElementRef<HTMLDivElement>;
  @ViewChild('map') mapItem!: ElementRef<HTMLDivElement>;

  @ViewChild(PopupContentComponent) popupComponent!: PopupContentComponent;

  private map!: L.Map;
  private userMarker!: L.Marker;
  private markers: L.Marker[] = [];
  private socket!: Socket;
  private takePicture!: TakePicture;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.takePicture = new TakePicture({
      picture: {
        video: this.popupComponent.video.nativeElement,
        canvas: this.popupComponent.canvas.nativeElement,
        captureButton: this.popupComponent.captureButton.nativeElement,
        photo: this.popupComponent.takenPhoto.nativeElement,
        switchCameraButton: this.el.nativeElement.querySelector('.switch-camera-button')
      }
    });

    this.initializeMap();
    this.setupSocket();
    this.setupUIInteractions();
  }

  private initializeMap(): void {
    this.map = L.map(this.mapItem.nativeElement).setView([-8.063245261243702, -34.87105100479096], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.userMarker = L.marker([51.505, -0.09], {
      icon: L.icon({
        iconUrl: 'assets/images/icons/gps2.png',
        iconSize: [30, 30],
        iconAnchor: [10, 10],
        popupAnchor: [1, 1]
      }),
      title: 'Sua localização'
    }).addTo(this.map);

    this.trackUserLocation();
  }

  private setupSocket(): void {
    this.socket = io('https://buscapet-production.up.railway.app/');

    this.socket.on('existingMarkers', (existingMarkers: any[]) => {
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

        const newMarker = L.marker(position, { icon: customIcon }).addTo(this.map);
        newMarker.bindPopup(marker.popupContent).openPopup();
        this.markers.push(newMarker);
      });
    });

    this.socket.on('newMarker', (markerData: any) => {
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

      const newMarker = L.marker(position, { icon: customIcon }).addTo(this.map);
      newMarker.bindPopup(markerData.popupContent).openPopup();
      this.markers.push(newMarker);
    });
  }

  private trackUserLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          this.userMarker.setLatLng(userPosition);

          setInterval(() => {
            this.map.setView(userPosition);

          }, 120000)
        },
        (error) => {
          this.handleLocationError(true, this.map.getCenter(), error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      this.handleLocationError(false, this.map.getCenter());
    }
  }

  private handleLocationError(browserHasGeolocation: boolean, pos: L.LatLng, message = "Unknown error"): void {
    L.popup()
      .setLatLng(pos)
      .setContent(
        browserHasGeolocation
          ? `Error: Unable to get your location (${message}).`
          : "Error: Your browser does not support geolocation."
      )
      .openOn(this.map);
  }

  private setupUIInteractions(): void {
    const colorButton = this.popupComponent.colorButton.nativeElement;
    const petDescription = this.popupComponent.petDescription.nativeElement;
    const petComment = this.popupComponent.petComment.nativeElement;
    const animalButton = this.popupComponent.animalButton.nativeElement;
    const sendButton = this.popupComponent.sendBtn.nativeElement;

    sendButton.addEventListener('click', () => {
      console.log(colorButton)
      console.log(petComment)
      console.log(petDescription)
      this.addMarkerFromCurrentLocation(colorButton!, petDescription!, petComment!, animalButton);
    });
  }

  private addMarkerFromCurrentLocation(markName: string, markDescription: string, markComment: string, animalButton: HTMLElement): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition: [number, number] = [position.coords.latitude, position.coords.longitude];
          
          const sketchMarkColor = this.popupComponent.sketchMarkColor.nativeElement;
          const markCanvas = this.popupComponent.markCanvas.nativeElement;
          const markPhoto = this.popupComponent.markPhoto.nativeElement;
          const canvas = this.popupComponent.canvas.nativeElement;
  
          const animalIcon = new AnimalIcon(sketchMarkColor, markCanvas, markPhoto, canvas);
  

          const marker = L.marker(userPosition, {
            icon: animalIcon.customIcon,
            title: 'Sua localização'
          }).addTo(this.map);

          const popupContent = this.createPopupContent(markName, markDescription, markComment, animalButton, animalIcon);
          marker.bindPopup(popupContent).openPopup();
          this.markers.push(marker);

          this.socket.emit('addMarker', {
            lat: userPosition[0],
            lng: userPosition[1],
            iconUrl: animalIcon.markPhoto!.src,
            iconSize: [48, 48],
            iconAnchor: [15, 40],
            popupAnchor: [0, -32],
            shadowUrl: animalIcon.customMark,
            shadowSize: [64, 64],
            shadowAnchor: [23, 41],
            popupContent
          });

          this.map.setView(userPosition);
        },
        () => {
          alert("Unable to retrieve your location. Please check your browser's location permissions.");
        },
        { timeout: 10000 }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  private createPopupContent(markName: any, markDescription: any, markComment: any, animalButton: HTMLElement, animalIcon: AnimalIcon): string {
    const icon = animalButton.childNodes[0].childNodes[0].childNodes[0] as HTMLElement;
    const text = animalButton.childNodes[0].childNodes[1].childNodes[0] as HTMLElement;

    return `
      <div class='left-column-profile'>
        <div class='profile-picture-content'>
          <div class='profile-picture-frame'>
            <img src="assets/images/background_asset/mark_popup_left_paint.png">
          </div>
          <div class='profile-picture-wrapper'>
            <img src="${animalIcon.markPhoto!.src}" style='width: 12em; aspect-ratio: 1;'>
            <div class='chosen-animal-content'>
              <div class='icon-content'>
                ${icon.outerHTML}
              </div>
              <div class='text-content'>
                <p>${text.textContent}</p>
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
            <p>${markDescription.value}</p>
          </div>
          <div class='comment-wrapper'>
            <div class='frame-container'>
              <div class='frame-title'>
                <p>Comentário</p>
              </div>
              <div class='frame-border'>
                <p>${markComment.value}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  showPopup(){
    console.log(this.popupComponent.video)

    this.takePicture.startCamera();
    

    console.log(this.mapItem)
    this.popupContent.nativeElement.classList.toggle('hidden');
    this.mapItem.nativeElement.classList.toggle('spotlight');
    this.popupComponent.firstStepContainer.nativeElement.classList.remove('hidden');
    console.log(this.popupComponent.firstStepContainer.nativeElement.classList);
}
}