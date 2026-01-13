/* =========================================================
   menu.js — Gestion du menu latéral gauche (off-canvas)
   Compatible GitHub Pages
   ========================================================= */

// Boutons et éléments du DOM
const openMenuBtn = document.getElementById("openMenu");
const closeMenuBtn = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");

// Ouvre le menu
if (openMenuBtn) {
  openMenuBtn.addEventListener("click", () => {
    sideMenu.classList.add("open");
  });
}

// Ferme le menu
if (closeMenuBtn) {
  closeMenuBtn.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });
}

// Fermer le menu avec la touche Échap
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    sideMenu.classList.remove("open");
  }
});
/* =========================================================
   MENU LATÉRAL — Fermeture automatique au clic extérieur
   ========================================================= */

document.addEventListener('click', function (e) {
  const menu = document.getElementById('sideMenu');
  const openBtn = document.getElementById('openMenu');

  if (!menu || !openBtn) return;

  const isMenuOpen = menu.classList.contains('open');
  if (!isMenuOpen) return;

  // Si clic en dehors du menu ET hors bouton d’ouverture
  if (!menu.contains(e.target) && !openBtn.contains(e.target)) {
    menu.classList.remove('open');
  }
});
document.querySelectorAll('#sideMenu a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('sideMenu').classList.remove('open');
  });
});
