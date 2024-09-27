export class TakePicture {
    private page: any;
    private currentCamera: string;
    private stream: MediaStream | null;

    constructor(page: any) {
        this.page = page;
        this.currentCamera = 'user';
        this.stream = null; 

        this.capturePhoto();
        this.switchCamera();
    }

    async startCamera() {
        try {
            const { picture } = this.page;

            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }

            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');

            const selectedDevice = videoDevices.find(device => {
                return this.currentCamera === 'user' ? device.label.includes('front') : device.label.includes('back');
            });

            const constraints = {
                video: {
                    deviceId: selectedDevice ? { exact: selectedDevice.deviceId } : undefined
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            picture.video.srcObject = this.stream;
            picture.video.play();
        } catch (err) {
            console.error("Error accessing camera: ", err);
        }
    }

    capturePhoto() {
        const { picture } = this.page;
        const context = picture.canvas.getContext('2d');
    
        picture.captureButton.addEventListener('click', () => {
            picture.canvas.width = picture.video.videoWidth;
            picture.canvas.height = picture.video.videoHeight;
            context.drawImage(picture.video, 0, 0, picture.canvas.width, picture.canvas.height);
            const dataURL = picture.canvas.toDataURL('image/png');
            picture.photo.src = dataURL;
            picture.photo.style.display = 'block';
    
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
            }
        });
    }

    switchCamera() {
        const { picture } = this.page;
        picture.switchCameraButton.addEventListener('click', () => {
            this.currentCamera = this.currentCamera === 'user' ? 'environment' : 'user';
            this.startCamera(); 
        });
    }
}
