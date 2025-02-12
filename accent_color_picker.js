const accentColorPicker = document.getElementById('accent-color-picker');
  
if (accentColorPicker) {
  const accentColorStyle = window.getComputedStyle(accentColorPicker);
  const accentColorD2S = accentColorStyle.color; // This should return something like 'rgb(52, 152, 219)'

  console.log('Computed color:', accentColorD2S); // Check if it's a valid color value

  // Save the color if it's valid
  if (accentColorD2S !== 'rgba(0, 0, 0, 0)') {
    document.documentElement.style.setProperty('--accentcolor', accentColorD2S);
    localStorage.setItem('accentColor', accentColorD2S);
  } else {
    console.warn('Accent color not found, using fallback.');
  }
}