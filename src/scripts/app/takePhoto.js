export class TakePicture{
    constructor(page){
        this.page = page;

        this.startCamera();
        this.capturePhoto();

    }

    startCamera() {
        const { picture } = this.page;

        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                picture.video.srcObject = stream;
                picture.video.play();
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
            });
    }

    capturePhoto() {
        const { picture } = this.page;
        const context = picture.canvas.getContext('2d');

        picture.captureButton.addEventListener('click', () =>{
            picture.canvas.width = picture.video.videoWidth;
            picture.canvas.height = picture.video.videoHeight;
            context.drawImage(picture.video, 0, 0, picture.canvas.width, picture.canvas.height);
            const dataURL = picture.canvas.toDataURL('image/png');
            picture.photo.src = dataURL;
            picture.photo.style.display = 'block';
        });
    }
    
}

