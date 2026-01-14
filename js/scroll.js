/* ============================================================
 * scroll.js — Bouton remonter en haut (bas gauche)
 * Apparition après léger scroll
 * ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  const scrollBtn = document.getElementById("scrollTopBtn");
  if (!scrollBtn) return;

  // Apparition après 150px de scroll
  window.addEventListener("scroll", function () {
    if (window.scrollY > 150) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  }, { passive: true });

  // Action clic : remonter en haut
  scrollBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

});
