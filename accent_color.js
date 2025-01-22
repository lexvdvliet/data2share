const element = document.getElementById('accent-color-picker');
const style = window.getComputedStyle(element);
let accentColorD2S = style.color;
document.documentElement.style.setProperty('--accentcolor', accentColorD2S);