/* ============================================================
 * categorieMenu.js
 * Menu arborescent repliable — COMPATIBLE GITHUB PAGES
 * Tous niveaux repliables
 * ============================================================ */

document.addEventListener("DOMContentLoaded", function () {

  const container = document.getElementById("categorie-menu");
  if (!container) return;

  const menuItems = [
    {
      label: "Accueil",
      children: [
        { label: "Accueil", 
          url: "./index.html" }
      ]
    },
    {
      label: "Cote des marques postales",
      children: [
        {
          label: "Ouvrir la cote (site externe)",
          url: "https://enniogianni.github.io/leger/"
        }
      ]
    },
    {
      label: "Bureaux secondaires",
      children: [
        {
          label: "Présentation générale",
          url: "../categories/bureaux-secondaires.html"
        }
      ]
    },
    {
      label: "Dossier Articles",
      children: [
        {
          label: "Lettre franche de Sèvres (1793)",
          url: "../DossierArticles/1lettreFrancheDeSevres.html"
        },
        {
          label: "Lettre de Bléré (1783)",
          url: "../DossierArticles/2lettreDeBlere.html"
        },
        {
          label: "Études complémentaires",
          children: [
            {
              label: "Lettre administrative (1785)",
              url: "../DossierArticles/3lettreAdministrative1785.html"
            }
          ]
        }
      ]
    },
    {
      label: "Bibliographie",
      children: [
        {
          label: "Consulter la bibliographie",
          url: "../bibliographie.html"
        }
      ]
    }
  ];

  function buildMenu(items) {
    const ul = document.createElement("ul");

    items.forEach(item => {
      const li = document.createElement("li");

      if (item.children && item.children.length > 0) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "menu-folder";
        btn.textContent = item.label;
        btn.setAttribute("aria-expanded", "false");

        const subUl = buildMenu(item.children);
        subUl.hidden = true;

        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          const open = btn.getAttribute("aria-expanded") === "true";
          btn.setAttribute("aria-expanded", String(!open));
          subUl.hidden = open;
        });

        li.appendChild(btn);
        li.appendChild(subUl);
      }

      else if (item.url) {
        const a = document.createElement("a");
        a.href = item.url;
        a.textContent = item.label;

        if (/^https?:\/\//i.test(item.url)) {
          a.target = "_blank";
          a.rel = "noopener noreferrer";
        }

        li.appendChild(a);
      }

      ul.appendChild(li);
    });

    return ul;
  }

  container.appendChild(buildMenu(menuItems));
});
