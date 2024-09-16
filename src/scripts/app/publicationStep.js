import { TakePicture } from "./takePhoto.js";

export class PublicationStep{
    constructor(page){
        this.page = page;

        this.setListeners();
    }

    setListeners(){
        const { menu, picture, map } = this.page;
        
        //settando first step
        picture.startStepButton.addEventListener('click', () =>{
            
            const takePicture = new TakePicture(this.page);

            picture.popupContent.classList.toggle('hidden');
            picture.firstStepContainer.classList.toggle('hidden');
            map.self.classList.toggle('spotlight');


            //menu.blurBackground.classList.toggle('hidden')
            //menu.blurBackground.classList.toggle('spotlight')
        })

        //settando segundo step
        picture.captureButton.addEventListener('click', () =>{
            picture.firstStepContainer.classList.toggle('hidden');
            picture.secondStepContainer.classList.toggle('hidden');

            menu.blurBackground.classList.toggle('hidden');
            menu.blurBackground.classList.toggle('spotlight');
            picture.backButton.classList.toggle('hidden');
        })

        //settando back-button
        console.log(picture.backButton)
        picture.backButton.addEventListener('click', () =>{
            if(!picture.firstStepContainer.classList.contains('hidden')){

                picture.popupContent.classList.toggle('hidden');
                picture.firstStepContainer.classList.toggle('hidden');
                map.self.classList.toggle('spotlight');
                

            }else if(!picture.secondStepContainer.classList.contains('hidden')){
                
            }else if(!picture.thirdStepContainer.classList.contains('hidden')){

            }
        })

        picture.tryAgainButton.addEventListener('click', () =>{
                picture.firstStepContainer.classList.toggle('hidden');
                picture.secondStepContainer.classList.toggle('hidden');

                menu.blurBackground.classList.toggle('hidden');
                menu.blurBackground.classList.toggle('spotlight');
                picture.backButton.classList.toggle('hidden');

        })
    }
}