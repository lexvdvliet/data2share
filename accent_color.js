const savedAccentColor = localStorage.getItem('accentColor');

if (savedAccentColor) {
  const style = document.createElement('style');
  style.textContent = `:root { --accentcolor: ${savedAccentColor}; }`;
  document.head.appendChild(style);
}