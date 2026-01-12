document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".note-btn");
  const popup = document.getElementById("notePopup");
  const popupBody = document.getElementById("notePopupBody");
  const closeBtn = document.getElementById("closeNote");

  if (!buttons.length) {
    console.error("Aucun bouton de note trouvé");
    return;
  }

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      const noteId = button.getAttribute("data-note");
      const note = document.getElementById(noteId);

      if (!note) {
        alert("Note introuvable : " + noteId);
        return;
      }

      popupBody.innerHTML = note.innerHTML;
      popup.style.display = "block";
    });
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });

  popup.addEventListener("click", e => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});
