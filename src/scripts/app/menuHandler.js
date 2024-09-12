document.addEventListener('DOMContentLoaded', () => {
    const menu = document.querySelector('.menu-content');
    let startY;
    let startTime;
    let initialBottom;
    let isDragging = false;
    let endY;
    let draggingStartTimestamp;
    let draggingEndTimestamp;
  
    menu.addEventListener('touchstart', (e) => {
      e.preventDefault(); // Previne comportamento padrão
      isDragging = true;
      startY = e.touches[0].clientY;
      initialBottom = parseInt(window.getComputedStyle(menu).bottom, 10);
      draggingStartTimestamp = performance.now(); // Captura o tempo de início do arrasto usando performance.now()
    });
  
    menu.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
  
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      const newBottom = Math.min(Math.max(initialBottom + deltaY, -180), 0);
  
      menu.style.bottom = `${newBottom}px`;
    });
  
    menu.addEventListener('touchend', (e) => {
      if (!isDragging) return;
  
      isDragging = false;
      endY = e.changedTouches[0].clientY; // Posição final após o toque
      draggingEndTimestamp = performance.now(); // Captura o tempo de fim do arrasto
      const draggingDuration = draggingEndTimestamp - draggingStartTimestamp; // Calcula a duração do arrasto
      const currentBottom = parseInt(window.getComputedStyle(menu).bottom, 10);
  
      // Decide a posição final do menu com base na duração e direção do arrasto
      if (draggingDuration < 300) { // Se o arrasto durou menos que 300ms
        if (endY < startY) {
          // Arrasto rápido para cima
          menu.style.bottom = '0px';
        } else {
          // Arrasto rápido para baixo
          menu.style.bottom = '-180px';
        }
      } else {
        // Arrasto mais longo
        if (currentBottom > -90) {
          menu.style.bottom = '0px'; // Mover para 0px se arrasto lento para cima
        } else {
          menu.style.bottom = '-180px'; // Voltar para -180px se arrasto lento para baixo
        }
      }
    });
  });
  