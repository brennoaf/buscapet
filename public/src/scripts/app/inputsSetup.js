export class InputsSetups{
    constructor(page){
        this.page = page;

        this.customPlaceholder();
        this.setupDropdown();
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
                    dropdown.button.style.backgroundColor = '#FFC917';
                    this.page.markInputs.sketchMarkColor.style.fill = '#FFC917';

                }else if(dropdown.button.textContent == "Possivelmente perdido"){
                    dropdown.button.style.backgroundColor = '#A80101';
                    this.page.markInputs.sketchMarkColor.style.fill = '#A80101';

                }else if(dropdown.button.textContent == "Curtindo a paisagem"){
                    dropdown.button.style.backgroundColor = '#008604';
                    this.page.markInputs.sketchMarkColor.style.fill = '#008604';

                }else if(dropdown.button.textContent == "Acidentado/Socorro"){
                    dropdown.button.style.backgroundColor = '#2D0000';
                    this.page.markInputs.sketchMarkColor.style.fill = '#2D0000';

                }
            });
        });
    }

    customPlaceholder(){
        const { markInputs } = this.page;
        console.log(markInputs)

        markInputs.input.forEach(input => {
            const inputContainer = input.parentNode;
            const placeholder = inputContainer.childNodes[1];
            input.addEventListener('focus', () => {
                placeholder.style.fontSize = '16px';
                placeholder.style.top = 0;
                placeholder.style.marginLeft = '.1em';
                placeholder.style.top = '0';
                placeholder.style.color = '#EDB506';
            });

            //Modifica o input quando desselecionar
            input.addEventListener('blur', () => {
                if (!input.value) {
                    placeholder.style.fontSize = '17px';
                    placeholder.style.top = '22px';
                    placeholder.style.marginLeft = '0';
                    placeholder.style.color = '#E9D418';
                }
            });

            if (input.value) {
                placeholder.style.fontSize = '16px';
                placeholder.style.top = 0;
                placeholder.style.marginLeft = '.1em';
                placeholder.style.top = '0';
                placeholder.style.color = '#EDB506';
            }

            input.addEventListener('input', () =>{
                if(!input.classList.contains("input-extra-description")){
                    markInputs.sendBtn.disabled = false;
                }

                if(!input.value && !input.classList.contains("input-extra-description")){
                    markInputs.sendBtn.disabled = true;
                }
            })

        });
    }
}