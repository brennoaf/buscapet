export class InputsSetups{
    constructor(page){
        this.page = page;

        //this.customPlaceholder();
        this.setupDropdown();
        this.setValues();
    }

    setupDropdown() {
        const { dropdown } = this.page.markInputs.color;
        const dropdownOptions = dropdown.content.querySelectorAll('a');

        dropdown.button.addEventListener('click', () => {
            console.log('clicou')
            dropdown.content.classList.toggle('show');
        });

        //escondendo dropdown se clicar fora do objeto
        window.addEventListener('click', (event) => {
            if (!event.target.matches('.dropdown-button')) {
                if (dropdown.content.classList.contains('show')) {
                    dropdown.content.classList.remove('show');
                }
            }
        });


        dropdownOptions.forEach(option => {
            option.addEventListener('click', (event) => {
                event.preventDefault();
                const selectedValue = option.getAttribute('data-value');
                dropdown.button.textContent = selectedValue;
                dropdown.content.classList.remove('show');

                if(dropdown.button.textContent == "Morador das ruas"){
                    dropdown.button.style.color = '#FFC917';
                    this.page.markInputs.sketchMarkColor.style.fill = '#FFC917';

                }else if(dropdown.button.textContent == "Possivelmente perdido"){
                    dropdown.button.style.color = '#A80101';
                    this.page.markInputs.sketchMarkColor.style.fill = '#A80101';

                }else if(dropdown.button.textContent == "Curtindo a paisagem"){
                    dropdown.button.style.color = '#008604';
                    this.page.markInputs.sketchMarkColor.style.fill = '#008604';

                }else if(dropdown.button.textContent == "Acidentado/Socorro"){
                    dropdown.button.style.color = '#2D0000';
                    this.page.markInputs.sketchMarkColor.style.fill = '#2D0000';

                }
            });
        });
    }

    setValues(){
        const { markInputs } = this.page;
        const colorDropdownButton = document.querySelector('.choose-color-button');

        markInputs.input.forEach(input => {
            const inputContainer = input.parentNode;
            // const placeholder = inputContainer.childNodes[1];
            // input.addEventListener('focus', () => {
            //     placeholder.style.fontSize = '16px';
            //     placeholder.style.top = 0;
            //     placeholder.style.marginLeft = '.1em';
            //     placeholder.style.top = '0';
            //     placeholder.style.color = '#EDB506';
            // });

            // //Modifica o input quando desselecionar
            // input.addEventListener('blur', () => {
            //     if (!input.value) {
            //         placeholder.style.fontSize = '17px';
            //         placeholder.style.top = '22px';
            //         placeholder.style.marginLeft = '0';
            //         placeholder.style.color = '#E9D418';
            //     }
            // });

            // if (input.value) {
            //     placeholder.style.fontSize = '16px';
            //     placeholder.style.top = 0;
            //     placeholder.style.marginLeft = '.1em';
            //     placeholder.style.top = '0';
            //     placeholder.style.color = '#EDB506';
            // }

            input.addEventListener('input', () =>{
                if(!input.classList.contains("input-extra-description")){
                    markInputs.sendBtn.disabled = false;
                }

                if(!input.value && !input.classList.contains("input-extra-description")){
                    markInputs.sendBtn.disabled = true;
                }
            })

        });

        window.addEventListener('click', (event) =>{
            if(event.target.matches('.choose-animal-button')){
                markInputs.chooseAnimal.optionsContainer.classList.toggle('hidden');
                markInputs.chooseAnimal.content.style.justifyContent = 'center';

                if(getComputedStyle(event.target).marginLeft == '0px'){
                    markInputs.chooseAnimal.button.style.marginLeft = '3.5em';

                }else{
                    event.target.style.marginLeft = '0';

                }

            }else if(!event.target.matches('.choose-animal-options-container') && !markInputs.chooseAnimal.optionsContainer.classList.contains('hidden')){
                markInputs.chooseAnimal.optionsContainer.classList.toggle('hidden');

                markInputs.chooseAnimal.button.style.marginLeft = '3.5em';

            }
            console.log(event.target)

            if(event.target.classList.contains('animal-option')){
                markInputs.chooseAnimal.button.childNodes[1].childNodes[1].innerHTML = '';
                markInputs.chooseAnimal.button.childNodes[1].childNodes[3].childNodes[1].innerHTML = event.target.childNodes[3].childNodes[1].textContent;

                const newSvgChild = event.target.childNodes[1].childNodes[1].cloneNode(true);
                markInputs.chooseAnimal.button.childNodes[1].childNodes[1].appendChild(newSvgChild);

                console.log(markInputs.chooseAnimal.button.childNodes[1].childNodes[1].childNodes[0])
            }
        });
    }
}