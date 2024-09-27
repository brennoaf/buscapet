import * as L from 'leaflet';

export class AnimalIcon {
  sketchMarkColor: HTMLElement | null;
  markCanvas: HTMLCanvasElement | null;
  markPhoto: HTMLImageElement | null;
  canvas: HTMLCanvasElement | null;
  customIcon: L.Icon;
  markPhotoSrc: string;
  customMark: string;

  constructor(sketchMarkColor: any, markCanvas: any, markPhoto: any, canvas: any) {
    // this.sketchMarkColor = document.querySelector('.sketch-mark-color');
    // this.markCanvas = document.getElementById('mark-canvas') as HTMLCanvasElement | null;
    // this.markPhoto = document.getElementById('mark-photo') as HTMLImageElement | null;
    // this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null;

    this.sketchMarkColor = sketchMarkColor;
    this.markCanvas = markCanvas;
    this.markPhoto = markPhoto;
    this.canvas = canvas;

    if (!this.markCanvas || !this.markPhoto || !this.canvas) {
      throw new Error('Elementos DOM necessários não foram encontrados.');
    }

    const { customIcon, markImage, customMark } = this.setupCustomIcon(
      this.sketchMarkColor,
      this.markCanvas,
      this.markPhoto,
      this.canvas
    );
    
    this.customIcon = customIcon;
    this.markPhotoSrc = markImage.src;
    this.customMark = customMark;
  }

  setupCustomIcon(
    sketchMarkColor: HTMLElement | null,
    markCanvas: HTMLCanvasElement,
    markPhoto: HTMLImageElement,
    canvas: HTMLCanvasElement
  ): { customIcon: L.Icon; markImage: HTMLImageElement; customMark: string } {

    const colorFill = sketchMarkColor?.style.fill || '#FF0000';

    const customMark = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 1 23.6 24" fill="none">
        <path fill="${colorFill}" fill-rule="evenodd" clip-rule="evenodd" 
        d="M8.9461 21.1315L8.89129 21.0787L8.89035 21.0778C8.81273 21.0023 8.73386 20.9254 8.65394 20.8471C7.2824 19.5029 5.57222 17.7231 4.34999 15.6268C3.12314 13.5227 2.35382 11.04 2.96276 8.32592C5.09133 -1.11519 18.9197 -1.10413 21.0372 8.33595C21.6639 11.1292 20.831 13.6741 19.5403 15.8149C18.2545 17.9477 16.4747 19.7455 15.0992 21.0783C14.0956 22.0555 13.1259 22.7323 12.0296 22.7449C10.9283 22.7576 9.95462 22.098 8.95039 21.1357L8.9461 21.1315Z" />
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8.75 9.5C8.75 7.70507 10.2051 6.25 12 6.25C13.7949 6.25 15.25 7.70507 15.25 9.5C15.25 11.2949 13.7949 12.75 12 12.75C10.2051 12.75 8.75 11.2949 8.75 9.5Z"/>
      </svg>
    `);

    const context = markCanvas.getContext('2d');
    if (!context) {
      throw new Error('Falha ao obter o contexto do canvas.');
    }

    const size = Math.min(canvas.width, canvas.height);
    markCanvas.width = size;
    markCanvas.height = size;

    context.drawImage(canvas, 0, 0, size, size);

    const circularCanvas = document.createElement('canvas');
    circularCanvas.width = size;
    circularCanvas.height = size;
    const circularContext = circularCanvas.getContext('2d');

    if (!circularContext) {
      throw new Error('Falha ao obter o contexto do canvas circular.');
    }

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
      iconAnchor: [15, 40],
      popupAnchor: [0, -32],
      shadowUrl: customMark,
      shadowSize: [64, 64],
      shadowAnchor: [23, 41]
    });

    return { customIcon, markImage: markPhoto, customMark };
  }
}
