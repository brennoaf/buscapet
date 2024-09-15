export class MenuFloatButton{
    constructor(page){
        this.page = page;

        this.mainButtonHandler();
    }

    mainButtonHandler(){
        const { menu } = this.page;

        window.addEventListener('click', (event) =>{

            if(event.target.matches('.menu-main-button')){
                menu.mainButton.childNodes[1].classList.toggle('onfocus');

                menu.altButtons.forEach(button =>{
                    button.classList.toggle('initial')
                })

                menu.blurBackground.classList.toggle('hidden');

            }else{
                if(menu.mainButton.childNodes[1].classList.contains('onfocus')){
                    menu.mainButton.childNodes[1].classList.toggle('onfocus');

                    menu.altButtons.forEach(button =>{
                        button.classList.toggle('initial')
                    })

                    menu.blurBackground.classList.toggle('hidden'); 
                }
            }
        })

        

        menu.mainButton.addEventListener('click', () => {
        })
    }
}