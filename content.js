let enabled = true;
let targetLang = "fr";

chrome.storage.sync.get(["enabled", "lang"], (data) => {
  enabled = data.enabled ?? true;
  targetLang = data.lang ?? "fr";
});

chrome.storage.onChanged.addListener((changes) => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
  }

  if (changes.lang) {
    targetLang = changes.lang.newValue;
  }
});

document.addEventListener("selectionchange", () => {
  const texto = window.getSelection().toString().trim();

  if (!texto) {
    cerrarPopup();
  }
});

document.addEventListener("mouseup", async (e) => {
    if (!enabled) return;
  setTimeout(async () => {
    const texto = window.getSelection().toString().trim();

    if (!texto) return;

    const traduccion = await traducir(texto);

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    const x = rect.right + window.scrollX + 10; // 10px de separación
    const y = rect.top + window.scrollY;

    const maxX = window.innerWidth - 280; // ancho aprox popup
    const finalX = Math.min(x, maxX);

    crearPopup(traduccion, finalX, y);
  }, 10);
});

document.addEventListener("mousedown", (e) => {
  const popup = document.getElementById("trad-popup");

  // si clicas el popup no se cierra
  if (popup && popup.contains(e.target)) {
    return;
  }

  cerrarPopup();
});

async function traducir(texto) {
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx` +
    `&sl=auto` +
    `&tl=${targetLang}` +
    `&dt=t` +
    `&q=${encodeURIComponent(texto)}`;

  const res = await fetch(url);
  const data = await res.json();

  return data[0][0][0];
}

function crearPopup(texto, x, y) {
  let popup = document.getElementById("trad-popup");

  if (!popup) {
    popup = document.createElement("div");
    popup.id = "trad-popup";
    document.body.appendChild(popup);
  }

  popup.textContent = texto;

  popup.style.left = x + "px";
  popup.style.top = y + "px";

  popup.style.display = "block";
}

function cerrarPopup() {
  const popup = document.getElementById("trad-popup");

  if (popup) {
    popup.remove();
  }
}