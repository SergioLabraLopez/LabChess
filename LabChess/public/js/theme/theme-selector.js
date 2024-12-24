// theme-selector.js
document.addEventListener('DOMContentLoaded', () => {
    const themeSelector = document.getElementById('themeSelector');
  
    if (themeSelector) {
      themeSelector.addEventListener('change', function() {
        const selectedTheme = this.value;
        // console.log('Tema seleccionado: ', selectedTheme);
        
        // Cambiar la clase del body o cualquier otra lógica para cambiar el tema
        document.body.className = selectedTheme;
  
        // Puedes guardar el tema seleccionado en el localStorage para que persista en otras páginas
        localStorage.setItem('selectedTheme', selectedTheme);
      });
  
      // Aplicar el tema guardado previamente
      const savedTheme = localStorage.getItem('selectedTheme');
      if (savedTheme) {
        document.body.className = savedTheme;
        themeSelector.value = savedTheme;  // Ajustar el selector al valor guardado
      }
    }
  });
  