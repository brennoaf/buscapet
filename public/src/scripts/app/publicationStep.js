import { TakePicture } from "./takePhoto.js";

export class PublicationStep{
    constructor(page){
        this.page = page;

        this.setListeners();
    }

    setListeners(){
        const { menu, picture, map, markInputs } = this.page;
        
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
                

            }else if(!picture.thirdStepContainer.classList.contains('hidden')){
                picture.firstStepContainer.classList.toggle('hidden');
                picture.thirdStepContainer.classList.toggle('hidden');

                picture.backButton.classList.toggle('hidden');
            }
        })

        picture.tryAgainButton.addEventListener('click', () =>{
                picture.firstStepContainer.classList.toggle('hidden');
                picture.secondStepContainer.classList.toggle('hidden');

                menu.blurBackground.classList.toggle('hidden');
                menu.blurBackground.classList.toggle('spotlight');
                picture.backButton.classList.toggle('hidden');

        })

        picture.nextStepButton.addEventListener('click', () =>{
            picture.secondStepContainer.classList.toggle('hidden');
            picture.thirdStepContainer.classList.toggle('hidden');
            menu.blurBackground.classList.toggle('hidden');
            menu.blurBackground.classList.toggle('spotlight');
            picture.backButton.classList.toggle('hidden');

            const dataURL = picture.canvas.toDataURL('image/png');
            markInputs.markPhoto.src = dataURL;
            markInputs.markPhoto.style.display = 'block';

        });

        markInputs.sendBtn.addEventListener('click', () =>{
            picture.popupContent.classList.toggle('hidden');
            picture.thirdStepContainer.classList.toggle('hidden');
            map.self.classList.toggle('spotlight');

            //resetando
            setTimeout(() =>{
                this.page.markInputs.color.dropdown.button.style.backgroundColor = 'none';
                this.page.markInputs.color.dropdown.button.textContent = "";
                this.page.markInputs.sketchMarkColor.style.fill = 'gray';
            }, 10000)
        })

    }
}