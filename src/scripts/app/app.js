import { MenuFloatButton } from "./menuFloatButton.js"
import { TakePicture } from "./takePhoto.js";
import { PublicationStep } from "./publicationStep.js";

const page = {
    map: {
        self: document.getElementById('map'),

    },
    
    menu: {
        mainButton: document.querySelector('.menu-main-button'),
        altButtons: document.querySelectorAll('.alt-button-container'),
        blurBackground: document.querySelector('.blur-background'),

    },

    picture: {
        startStepButton: document.querySelector('.float-camera-button'),

        cameraContent: document.querySelector('.camera-content'),
        takePictureContent: document.querySelector('.take-picture-content'),
        video: document.getElementById('video'),
        canvas: document.getElementById('canvas'),
        photo: document.getElementById('photo'),
        captureButton: document.querySelector('.button-frame'),
        switchCameraButton: document.querySelector('.switch-camera-button'),

        popupContent: document.querySelector('.popup-content'),
        firstStepContainer: document.querySelector('.first-step'),
        secondStepContainer: document.querySelector('.second-step'),
        thirdStepContainer: document.querySelector('.third-step'),

        backButton: document.querySelector('.back-button'),
        tryAgainButton: document.querySelector('.try-button')
    }
}

const menuFloatButton = new MenuFloatButton(page);
// const takePicture = new TakePicture(page);
const publicationStep = new PublicationStep(page);