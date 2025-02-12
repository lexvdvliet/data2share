const savedAccentColor = localStorage.getItem('accentColor');

if (savedAccentColor) {
  // Inject into a style tag early in the head
  const style = document.createElement('style');
  style.textContent = `:root { --accentcolor: ${savedAccentColor}; }`;
  document.head.appendChild(style);
}