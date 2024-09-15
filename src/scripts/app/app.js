import { MenuFloatButton } from "./menuFloatButton.js"

const page = {
    menu: {
        mainButton: document.querySelector('.menu-main-button'),
        altButtons: document.querySelectorAll('.alt-button-container'),
        blurBackground: document.querySelector('.blur-background'),
    }
}

const menuFloatButton = new MenuFloatButton(page);