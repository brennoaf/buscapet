import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-float-buttons',
  templateUrl: './float-buttons.component.html',
  styleUrls: ['./float-buttons.component.scss']
})
export class FloatButtonsComponent implements OnInit {
  @ViewChild('floatCameraButton') floatCameraButton!: ElementRef<HTMLButtonElement>;
  @ViewChild('menuMainButton') menuMainButton!: ElementRef;
  @Input() blurBackground!: HTMLDivElement;
  @ViewChildren('altButtonContainer') altButtons!: QueryList<ElementRef>;

  @Output() camButtonClicked = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.setupMainButtonHandler();

    this.floatCameraButton.nativeElement.addEventListener('click', () => {

      this.camButtonClicked.emit();
    });
  }

  setupMainButtonHandler() {
    const { nativeElement: mainButton } = this.menuMainButton;

    window.addEventListener('click', (event) => {

      if (event.target === mainButton) {
        mainButton.childNodes[0].classList.toggle('onfocus');
        
        this.altButtons.forEach((button) => {
          button.nativeElement.classList.toggle('initial');
        });

        console.log(this.blurBackground)
        this.blurBackground.classList.toggle('hidden');
      } else {
        if (mainButton.childNodes[0].classList.contains('onfocus')) {
          mainButton.childNodes[0].classList.toggle('onfocus');

          this.altButtons.forEach((button) => {
            button.nativeElement.classList.toggle('initial');
          });

          this.blurBackground.classList.toggle('hidden');
        }
      }
    });
  }
}
