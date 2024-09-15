// script.js
document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const photo = document.getElementById('photo');
    const captureButton = document.getElementById('capture');

    // Função para iniciar a câmera
    function startCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                video.srcObject = stream;
                video.play();
            })
            .catch(err => {
                console.error("Error accessing camera: ", err);
            });
    }

    // Função para capturar a foto
    function capturePhoto() {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        photo.src = dataURL;
        photo.style.display = 'block';
    }

    // Iniciar a câmera quando a página carregar
    startCamera();

    // Capturar a foto quando o botão for clicado
    captureButton.addEventListener('click', capturePhoto);
});
