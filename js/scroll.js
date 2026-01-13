/* =========================================================
   scroll.js — Bouton remonter bas gauche
   Apparition après léger scroll
   ========================================================= */

const scrollBtn = document.getElementById("scrollTopBtn");

if (scrollBtn) {

  // Apparition après 150px de scroll
  window.addEventListener("scroll", () => {
    if (window.scrollY > 150) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  });

  // Action clic
  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}
