/* =========================================================
   recherche-simple.js
   Recherche simple + accents, compatible #content / #article
   ========================================================= */

const input = document.getElementById("globalSearch");
const count = document.getElementById("globalSearchCount");

/* Cible robuste : #content OU #article, sinon <main>, sinon body */
const root =
  document.getElementById("content") ||
  document.getElementById("article") ||
  document.querySelector("main") ||
  document.body;

if (!input || !count || !root) {
  console.warn("Recherche : éléments introuvables (input/count/root)");
}

/* ===== état ===== */
let marks = [];
let current = -1;

/* ===== normalisation accents ===== */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/* ===== nettoyage ===== */
function clearMarks() {
  root.querySelectorAll("mark").forEach(m => {
    m.replaceWith(document.createTextNode(m.textContent));
  });
  root.normalize();
  marks = [];
  current = -1;
  count.textContent = "0";
}

/* ===== recherche ===== */
function search(text) {
  clearMarks();
  if (!text) return;

  const q = normalize(text);
  let total = 0;

  root.querySelectorAll("*").forEach(el => {
    el.childNodes.forEach(node => {
      if (node.nodeType !== 3) return;

      const original = node.nodeValue;
      const normText = normalize(original);

      let pos = normText.indexOf(q);
      if (pos === -1) return;

      const frag = document.createDocumentFragment();
      let last = 0;

      while (pos !== -1) {
        frag.appendChild(document.createTextNode(original.slice(last, pos)));

        const mark = document.createElement("mark");
        mark.className = "search-hit";
        mark.textContent = original.slice(pos, pos + q.length);
        frag.appendChild(mark);

        marks.push(mark);
        total++;

        last = pos + q.length;
        pos = normText.indexOf(q, last);
      }

      frag.appendChild(document.createTextNode(original.slice(last)));
      node.replaceWith(frag);
    });
  });

  count.textContent = String(total);

  if (marks.length) activate(0);
}

/* ===== activation + navigation (tes boutons existent) ===== */
function activate(i) {
  marks.forEach(m => m.classList.remove("search-hit-active"));
  current = i;
  const el = marks[current];
  el.classList.add("search-hit-active");
  el.scrollIntoView({ behavior: "smooth", block: "center" });
}

const btnPrev = document.getElementById("btnPrevHit");
const btnNext = document.getElementById("btnNextHit");

if (btnPrev) {
  btnPrev.addEventListener("click", () => {
    if (!marks.length) return;
    activate((current - 1 + marks.length) % marks.length);
  });
}

if (btnNext) {
  btnNext.addEventListener("click", () => {
    if (!marks.length) return;
    activate((current + 1) % marks.length);
  });
}

input.addEventListener("input", () => {
  search(input.value.trim());
});

input.addEventListener("keydown", e => {
  if (e.key === "Enter" && marks.length) {
    e.preventDefault();
    activate((current + 1) % marks.length);
  }
});
