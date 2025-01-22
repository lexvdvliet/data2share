const accentColorPicker = document.getElementById('accent-color-picker');
const accentColorStyle = window.getComputedStyle(accentColorPicker);
let accentColorD2S = accentColorStyle.color;
document.documentElement.style.setProperty('--accentcolor', accentColorD2S);