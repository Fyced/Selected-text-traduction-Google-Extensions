const toggle = document.getElementById("toggle");
const lang = document.getElementById("lang");

// cargar estado guardado
chrome.storage.sync.get(["enabled", "lang"], (data) => {
  toggle.checked = data.enabled ?? true;
  lang.value = data.lang ?? "fr";
});

// guardar cambios
toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked });
});

lang.addEventListener("change", () => {
  chrome.storage.sync.set({ lang: lang.value });
});