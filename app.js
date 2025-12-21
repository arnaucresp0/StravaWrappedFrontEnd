const API = "https://strava-wrapped-backend.onrender.com";

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

async function generateWrapped() {
  mainBtn.disabled = true;
  mainBtn.innerText = "Generant el teu Wrapped...";

  const res = await fetch(`${API}/wrapped/image`, {
    credentials: "include"
  });

  const data = await res.json();

  // Guardem tant les imatges com els noms
  images = data.images;
  imageNames = data.image_names || [  // Si el backend retorna noms
    "resum_any.png", "km_totals.png", "temps_total.png", 
    "desnivell.png", "esport_dominant.png", "millor_activitat.png",
    "dades_socials.png", "energia.png", "esports_practicats.png"
  ];
  
  currentIndex = 0;

  wrappedDiv.style.display = "block";
  showImage(currentIndex);
  mainBtn.style.display = "none";
}

// Descarrega amb nom descriptiu
downloadBtn.onclick = () => {
  const base64Image = images[currentIndex];
  const link = document.createElement("a");
  
  // Usar nom descriptiu o genèric
  const name = imageNames[currentIndex] || `strava_wrapped_${currentIndex + 1}.jpg`;
  link.download = name;
  link.href = `data:image/jpeg;base64,${base64Image}`;
  
  link.click();
};

function showImage(index) {
  const base64Image = images[index];
  // Canvia 'png' per 'jpeg' (o deixa-ho dinàmic)
  carouselImage.src = `data:image/jpeg;base64,${base64Image}`;
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

