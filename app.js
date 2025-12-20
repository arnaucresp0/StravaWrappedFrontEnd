const API = "http://localhost:8000";

const mainBtn = document.getElementById("mainBtn");
const wrappedDiv = document.getElementById("wrapped");
let images = [];
let currentIndex = 0;

const carouselImage = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const downloadBtn = document.getElementById("downloadBtn");


mainBtn.onclick = async () => {
  // 1️⃣ Comprovar sessió
  const res = await fetch(`${API}/me`, {
    credentials: "include"
  });

  const data = await res.json();

  // 2️⃣ Si no està autenticat → OAuth
  if (!data.authenticated) {
    window.location.href = `${API}/auth`;
    return;
  }

  // 3️⃣ Si està autenticat → generar wrapped
  generateWrapped();
};

prevBtn.onclick = () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  showImage(currentIndex);
};

nextBtn.onclick = () => {
  currentIndex = (currentIndex + 1) % images.length;
  showImage(currentIndex);
};

downloadBtn.onclick = () => {
  const name = images[currentIndex];
  const link = document.createElement("a");
  link.href = `${API}/wrapped/image/${name}`;
  link.download = name;
  link.click();
};

async function generateWrapped() {
  mainBtn.disabled = true;
  mainBtn.innerText = "Generant el teu Wrapped...";

  const res = await fetch(`${API}/wrapped/image`, {
    credentials: "include"
  });

  const data = await res.json();

  // Guardem noms d'imatge
  images = data.images.map(path => path.split("\\").pop());
  currentIndex = 0;

  // Mostrem secció wrapped
  wrappedDiv.style.display = "block";

  // Mostrem primera imatge
  showImage(currentIndex);

  // Amaguem botó principal
  mainBtn.style.display = "none";
}

function showImage(index) {
  const name = images[index];
  carouselImage.src = `${API}/wrapped/image/${name}`;
}

const infoBtn = document.getElementById("infoBtn");
const infoModal = document.getElementById("infoModal");
const closeModalBtn = document.getElementById("closeModalBtn");

infoBtn.onclick = () => {
  infoModal.style.display = "flex";
};

closeModalBtn.onclick = () => {
  infoModal.style.display = "none";
};

// Tancar clicant fora
infoModal.onclick = (e) => {
  if (e.target === infoModal) {
    infoModal.style.display = "none";
  }
};

