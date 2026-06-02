const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("open");
      document.body.classList.remove("nav-open");
    }
  });
}

const tabButtons = document.querySelectorAll("[data-tab]");
const tabPanels = document.querySelectorAll(".tab-panel");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-tab");

    tabButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    tabPanels.forEach((panel) => {
      const isActive = panel.id === targetId;
      panel.classList.toggle("active", isActive);
      panel.hidden = !isActive;
    });
  });
});

if (window.lucide) {
  window.lucide.createIcons({
    attrs: {
      "aria-hidden": "true",
    },
  });
}

if (window.AOS) {
  document.documentElement.classList.add("aos-ready");
  window.AOS.init({
    once: true,
    duration: 720,
    easing: "ease-out-cubic",
    offset: 80,
    disable: () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  });
}
