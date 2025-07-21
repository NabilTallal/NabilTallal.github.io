document.addEventListener('DOMContentLoaded', () => {
  const parallaxContainer = document.querySelector('.parallax-container');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  const parallaxItems = document.querySelectorAll('.parallax-item');

  if (!parallaxContainer) {
    console.error("No .parallax-container found");
    return;
  }

  let scrollTop = 0;
  const initialPositions = new Map();


  function getCenter() {
    const { width, height } = parallaxContainer.getBoundingClientRect();
    return { x: width / 2, y: height / 2 };
  }

  function setInitialPositions() {
    const containerRect = parallaxContainer.getBoundingClientRect();

    parallaxItems.forEach(item => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2 - containerRect.left;
      const itemCenterY = rect.top + rect.height / 2 - containerRect.top;
      initialPositions.set(item, { x: itemCenterX, y: itemCenterY });


      item.style.transform = 'translate(0, 0) translateZ(0) scale(1) rotate(0deg)';
      item.style.filter = '';
    });
  }

  function updateParallax() {
    scrollTop = parallaxContainer.scrollTop;
    const center = getCenter();


    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed) || 0.5;
      const yPos = -(scrollTop * speed * 0.7);
      const zPos = -(scrollTop * speed * 0.15);
      layer.style.transform = `translate3d(0, ${yPos}px, ${zPos}px)`;
    });


    const scrollHeight = parallaxContainer.scrollHeight - parallaxContainer.clientHeight;
    const progress = scrollHeight > 0 ? Math.min(scrollTop / scrollHeight, 1) : 0;


    const moveFactor = progress * 2;

    parallaxItems.forEach(item => {
      const speed = parseFloat(item.dataset.speed) || 0.5;
      const initPos = initialPositions.get(item);
      if (!initPos) return;


      const vectorX = center.x - initPos.x;
      const vectorY = center.y - initPos.y;


      const currentX = initPos.x + vectorX * moveFactor;
      const currentY = initPos.y + vectorY * moveFactor;

      const translateX = currentX - initPos.x;
      const translateY = currentY - initPos.y;


      const scale = 1 + progress * 0.5 * speed;


      let rotation = 0;
      if (item.classList.contains('asteroid-1') || item.classList.contains('asteroid-2')) {
        rotation = scrollTop * 0.1 * speed;
      }


      if (item.classList.contains('planet-1') || item.classList.contains('planet-2')) {
        const glowIntensity = 0.5 + Math.sin(scrollTop * 0.02) * 0.5;
        item.style.filter = `drop-shadow(0 0 ${10 + glowIntensity * 30}px rgba(79, 195, 247, ${glowIntensity}))`;
      } else {
        item.style.filter = '';
      }

      item.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotation}deg)`;
    });

    requestAnimationFrame(updateParallax);
  }

  setInitialPositions();
  updateParallax();

  parallaxContainer.addEventListener('scroll', () => {
    scrollTop = parallaxContainer.scrollTop;
  });

  window.addEventListener('resize', () => {
    setInitialPositions();
  });


  const spaceship = document.querySelector('.spaceship');
  if (spaceship) {
    let floatY = 0, floatX = 0;
    let dirY = 1, dirX = 1;
    let rotation = 0;

    function animateSpaceship() {
      floatY += dirY * 0.4;
      floatX += dirX * 0.15;
      rotation += dirY * 0.05;

      spaceship.style.transform = `translate(${floatX}px, ${floatY}px) rotate(${rotation}deg)`;

      if (Math.abs(floatY) > 20) dirY *= -1;
      if (Math.abs(floatX) > 10) dirX *= -1;

      requestAnimationFrame(animateSpaceship);
    }

    animateSpaceship();
  }
});
