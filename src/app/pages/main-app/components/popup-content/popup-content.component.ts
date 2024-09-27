import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { TakePicture } from './services/takePhoto';
import { MainAppComponent } from '../../main-app.component';

@Component({
  selector: 'app-popup-content',
  templateUrl: './popup-content.component.html',
  styleUrls: ['./popup-content.component.scss']
})
export class PopupContentComponent implements AfterViewInit {
  @ViewChild('firstStepContainer') firstStepContainer!: ElementRef;
  @ViewChild('secondStepContainer') secondStepContainer!: ElementRef;
  @ViewChild('thirdStepContainer') thirdStepContainer!: ElementRef;

  @ViewChild('backButton') backButton!: ElementRef;
  @ViewChild('captureButton') captureButton!: ElementRef; 
  @ViewChild('tryAgainButton') tryAgainButton!: ElementRef; 
  @ViewChild('nextStepButton') nextStepButton!: ElementRef; 

  @ViewChild('markPhoto') markPhoto!: ElementRef;
  @ViewChild('takenPhoto') takenPhoto!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;
  @ViewChild('markCanvas') markCanvas!: ElementRef;
  @ViewChild('video') video!: ElementRef;
  @ViewChild('sendBtn') sendBtn!: ElementRef;

  @ViewChild('sketchMarkColor') sketchMarkColor!: ElementRef;
  @ViewChild('colorButton') colorButton!: ElementRef;
  @ViewChild('petDescription') petDescription!: ElementRef;
  @ViewChild('petComment') petComment!: ElementRef;
  @ViewChild('animalButton') animalButton!: ElementRef;

  @ViewChild('animalOptionsContent') animalOptionsContent!: ElementRef;

  @ViewChild('MainAppComponent') mainComponent!: MainAppComponent;
  @Input() popupContent!: HTMLDivElement;
  @Input() map!: HTMLDivElement;

  public takePicture!: TakePicture;

  constructor(private el: ElementRef) {
    this.popupContent
  }

  ngAfterViewInit() {
    this.takePicture = new TakePicture({
      picture: {
        video: this.video.nativeElement,
        canvas: this.canvas.nativeElement,
        captureButton: this.captureButton.nativeElement,
        photo: this.markPhoto.nativeElement,
        switchCameraButton: this.el.nativeElement.querySelector('.switch-camera-button')
      }
    });

    this.setListeners();
    this.setupDropdown();
    this.setValues();

    setTimeout(() => {
    console.log(this.popupContent);
  });
  }

  setListeners() {
    this.captureButton.nativeElement.addEventListener('click', () => {
      this.firstStepContainer.nativeElement.classList.add('hidden');
      this.secondStepContainer.nativeElement.classList.remove('hidden');
      this.backButton.nativeElement.classList.toggle('hidden');

      const dataURL = this.canvas.nativeElement.toDataURL('image/png');
      this.takenPhoto.nativeElement.src = dataURL;
      this.takenPhoto.nativeElement.style.display = 'block';

    });

    this.backButton.nativeElement.addEventListener('click', () => {

      if (!this.firstStepContainer.nativeElement.classList.contains('hidden')) {
        this.popupContent.classList.toggle('hidden');
        this.firstStepContainer.nativeElement.classList.toggle('hidden');
        this.map.classList.toggle('spotlight')

      } else if (!this.thirdStepContainer.nativeElement.classList.contains('hidden')) {
        this.firstStepContainer.nativeElement.classList.remove('hidden');
        this.thirdStepContainer.nativeElement.classList.add('hidden');

        this.takePicture.startCamera();

      }
    });

    this.tryAgainButton.nativeElement.addEventListener('click', () => {
      this.firstStepContainer.nativeElement.classList.remove('hidden');
      this.secondStepContainer.nativeElement.classList.add('hidden');
      this.backButton.nativeElement.classList.remove('hidden');

      this.takePicture.startCamera();
    });

    this.nextStepButton.nativeElement.addEventListener('click', () => {
      this.secondStepContainer.nativeElement.classList.add('hidden');
      this.thirdStepContainer.nativeElement.classList.remove('hidden');
      this.backButton.nativeElement.classList.remove('hidden');

      const dataURL = this.canvas.nativeElement.toDataURL('image/png');
      this.markPhoto.nativeElement.src = this.takenPhoto.nativeElement.src;
      this.markPhoto.nativeElement.style.display = 'block';
    });

    this.sendBtn.nativeElement.addEventListener('click', () => {
      this.popupContent.classList.add('hidden');
      this.thirdStepContainer.nativeElement.classList.add('hidden');

      setTimeout(() => {
        this.markPhoto.nativeElement.src = '';
        this.markPhoto.nativeElement.style.display = 'none';
      }, 10000);
    });
  }

  setupDropdown() {
    const dropdown = this.el.nativeElement.querySelector('.dropdown-content') as HTMLElement;
    const dropdownButton = this.el.nativeElement.querySelector('.choose-color-button') as HTMLElement;
    const dropdownOptions = dropdown.querySelectorAll('a');

    if (dropdownButton) {
      dropdownButton.addEventListener('click', () => {
        dropdown.classList.toggle('show');
      });
    }

    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;

      if (target && !target.matches('.choose-color-button')) {
        if (dropdown.classList.contains('show')) {
          dropdown.classList.remove('show');
        }
      }
    });

    dropdownOptions.forEach(option => {
      option.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        const selectedValue = option.getAttribute('data-value');
        const sendBtn = this.sendBtn.nativeElement;
        const animalButtonText = this.animalButton.nativeElement.childNodes[0].childNodes[1].childNodes[0] as HTMLElement;

        if(this.petDescription.nativeElement.value && this.petComment.nativeElement.value && animalButtonText.textContent!.trim() != 'Escolher animal'){
          sendBtn.disabled = false;

        }else{
          sendBtn.disabled = true;
        }


        if (selectedValue) {
          dropdownButton.textContent = selectedValue;
          dropdown.classList.remove('show');

          this.updateDropdownStyles(selectedValue);
        }
      });
    });
  }

  updateDropdownStyles(selectedValue: string) {
    
    const colorMap: { [key: string]: string } = {
      "Morador das ruas": '#FFC917',
      "Possivelmente perdido": '#A80101',
      "Curtindo a paisagem": '#008604',
      "Acidentado/Socorro": '#2D0000',
    };

    const color = colorMap[selectedValue] || '#000';
    const dropdownButton = this.el.nativeElement.querySelector('.choose-color-button');
    const sketchMarkColor = this.el.nativeElement.querySelector('.sketch-mark-color');

    if (dropdownButton) {
      dropdownButton.style.color = color;
    }
      sketchMarkColor.style.fill = color;
  }

  setValues() {
    const inputs = this.el.nativeElement.querySelectorAll('.mark-input');
    const sendBtn = this.sendBtn.nativeElement;

    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener('input', () => {
  
        const animalButtonText = this.animalButton.nativeElement.childNodes[0].childNodes[1].childNodes[0] as HTMLElement;
        if(this.petDescription.nativeElement.value && this.petComment.nativeElement.value && this.colorButton.nativeElement.textContent.trim() != 'Cor' && animalButtonText.textContent!.trim() != 'Escolher animal'){
          sendBtn.disabled = false;

        }else{
          sendBtn.disabled = true;
        }
      });
    });

    window.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const chooseAnimalButton = this.el.nativeElement.querySelector('.choose-animal-button') as HTMLElement;
      const optionsContainer = this.el.nativeElement.querySelector('.choose-animal-options-container') as HTMLElement;

      if (target.matches('.choose-animal-button')) {
        optionsContainer.classList.toggle('hidden');
        this.animalOptionsContent.nativeElement.style.justifyContent = 'center';

        if(getComputedStyle(target).marginLeft == '0px'){
          chooseAnimalButton.style.marginLeft = '3.5em';

        }else{
            target.style.marginLeft = '0';

        }

      } else if (!target.matches('.choose-animal-options-container') && !optionsContainer.classList.contains('hidden')) {
        optionsContainer.classList.toggle('hidden');

        chooseAnimalButton.style.marginLeft = '3.5em';

      }

      if (target.classList.contains('animal-option')) {
        const targetSvg = target.childNodes[0].childNodes[0].cloneNode(true) as HTMLElement;
        const targetText = target.childNodes[1].textContent

        const buttonSvg = chooseAnimalButton.childNodes[0].childNodes[0] as HTMLElement;
        const buttonText = chooseAnimalButton.childNodes[0].childNodes[1] as HTMLElement;

        buttonText.textContent = targetText;
        
        buttonSvg.innerHTML = '';
        buttonSvg.appendChild(targetSvg);

        if(this.petDescription.nativeElement.value && this.petComment.nativeElement.value && this.colorButton.nativeElement.textContent.trim() != 'Cor'){
          sendBtn.disabled = false;

        }else{
          sendBtn.disabled = true;
        }

      }
    });
  }
}
