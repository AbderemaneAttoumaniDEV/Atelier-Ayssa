// Variables
let scrolling = true;
const scrollingMessage = document.getElementById('scrolling-message');
const stopScrollButton = document.getElementById('stop-scroll');
const hideScrollButton = document.getElementById('hide-scroll');

// Initial state: animation is running
scrollingMessage.style.animationPlayState = 'running';

// Fonction pour changer l'icône du bouton de stop-scroll
function updateStopScrollIcon() {
  if (scrolling) {
    stopScrollButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:mr-32 lg:mr-96" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6" />
      </svg>
    `;
  } else {
    stopScrollButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 md:mr-32 lg:mr-96" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5v14l11-7z" />
      </svg>
    `;
  }
}

// Stop/start scrolling text
stopScrollButton.addEventListener('click', () => {
  if (scrolling) {
    scrollingMessage.style.animationPlayState = 'paused'; // Stop the animation
  } else {
    scrollingMessage.style.animationPlayState = 'running'; // Start the animation
  }
  scrolling = !scrolling; // Toggle the scrolling state
  updateStopScrollIcon(); // Update the button icon
});

// Hide scrolling text
hideScrollButton.addEventListener('click', () => {
  const scrollingText = document.getElementById('scrolling-text');
  scrollingText.classList.add('opacity-0', 'transition', 'duration-500');
  setTimeout(() => {
    scrollingText.style.display = 'none';
  }, 500);
});

// Sélectionner tous les conteneurs de défilement
const scrollContainers = document.querySelectorAll('.scroll-container');

scrollContainers.forEach(scrollContainer => {
    let isMouseDown = false;
    let startX, scrollLeft;

    scrollContainer.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        startX = e.pageX - scrollContainer.offsetLeft;
        scrollLeft = scrollContainer.scrollLeft;
    });

    scrollContainer.addEventListener('mouseleave', () => {
        isMouseDown = false;
    });

    scrollContainer.addEventListener('mouseup', () => {
        isMouseDown = false;
    });

    scrollContainer.addEventListener('mousemove', (e) => {
        if (!isMouseDown) return;
        e.preventDefault();
        const x = e.pageX - scrollContainer.offsetLeft;
        const walk = (x - startX) * 1.5; // Ajuster la vitesse du défilement horizontal
        scrollContainer.scrollLeft = scrollLeft - walk;
    });

    // Ajout du défilement horizontal avec la molette
    scrollContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            scrollContainer.scrollLeft += e.deltaY; // Défilement horizontal avec la molette
        }
    });
});



// Fonction pour ouvrir la modal et afficher l'image en grand
function openModal(img) {
    const modal = document.getElementById("imageModal");
    const modalImage = document.getElementById("modalImage");
    modal.classList.remove("hidden"); // Afficher la modal
    modalImage.src = img.src; // Mettre la source de l'image dans la modal

    // Désactiver le défilement de la page
    document.body.classList.add("modal-open");
}

// Fonction pour fermer la modal
document.getElementById("closeModal").addEventListener("click", function() {
    const modal = document.getElementById("imageModal");
    modal.classList.add("hidden"); // Cacher la modal

    // Réactiver le défilement de la page
    document.body.classList.remove("modal-open");
});

// Fermer la modal si l'utilisateur clique en dehors de l'image
document.getElementById("imageModal").addEventListener("click", function(e) {
    if (e.target === this) {
        const modal = document.getElementById("imageModal");
        modal.classList.add("hidden"); // Cacher la modal

        // Réactiver le défilement de la page
        document.body.classList.remove("modal-open");
    }
});

// Fonction de zoom/dézoom avec la molette de la souris
let currentZoom = 1;
function zoomImage(event) {
    event.preventDefault();
    const modalImage = document.getElementById("modalImage");
    if (event.deltaY < 0) {
        currentZoom += 0.1; // Zoom avant
    } else {
        currentZoom -= 0.1; // Zoom arrière
    }

    // Limite le zoom entre 0.5 et 3
    if (currentZoom < 0.5) currentZoom = 0.5;
    if (currentZoom > 3) currentZoom = 3;

    modalImage.style.transform = `scale(${currentZoom})`;
}

// Zoom avant
document.getElementById("zoomIn").addEventListener("click", function() {
    currentZoom += 0.1;
    if (currentZoom > 3) currentZoom = 3;
    const modalImage = document.getElementById("modalImage");
    modalImage.style.transform = `scale(${currentZoom})`;
});

// Zoom arrière
document.getElementById("zoomOut").addEventListener("click", function() {
    currentZoom -= 0.1;
    if (currentZoom < 0.5) currentZoom = 0.5;
    const modalImage = document.getElementById("modalImage");
    modalImage.style.transform = `scale(${currentZoom})`;
});




// Fonction de défilement fluide avec animation
function smoothScrollTo(target) {
    const targetElement = document.querySelector(target);
    if (!targetElement) return; // Si la cible n'existe pas, on arrête

    // Obtenir la position de l'élément cible
    const targetPosition = targetElement.offsetTop;
    const startPosition = window.pageYOffset; // Position actuelle de la page
    const distance = targetPosition - startPosition; // Distance à parcourir
    const duration = 1000; // Durée de l'animation en millisecondes
    let startTime = null;

    // Fonction d'animation
    function animateScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOut(timeElapsed, startPosition, distance, duration); // Easing
        window.scrollTo(0, run);
        if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll); // Répéter l'animation
        }
    }

    // Fonction d'easing pour un effet plus naturel
    function easeInOut(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return (c / 2) * t * t + b;
        t--;
        return (-c / 2) * (t * (t - 2) - 1) + b;
    }

    // Lancer l'animation
    requestAnimationFrame(animateScroll);
}

// Sélectionner tous les liens du menu avec la classe 'smooth-scroll'
const links = document.querySelectorAll('.smooth-scroll');

// Ajouter un événement de clic sur chaque lien
links.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); // Empêche le comportement par défaut du lien
        const target = link.getAttribute('href'); // Récupère l'ID du lien cliqué
        smoothScrollTo(target); // Appelle la fonction de défilement animé
    });
});