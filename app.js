const API = "https://strava-wrapped-backend.onrender.com";

// Llegeix token de la URL si existeix
const urlParams = new URLSearchParams(window.location.search);
const urlToken = urlParams.get('token');

if (urlToken) {
  console.log("🔑 Token rebut de la URL");
  localStorage.setItem('strava_session_token', urlToken);
  
  // Neteja la URL per seguretat (elimina el paràmetre token)
  window.history.replaceState({}, '', window.location.pathname);
}

const mainBtn = document.getElementById("mainBtn");
const wrappedDiv = document.getElementById("wrapped");
let images = [];
let currentIndex = 0;

const carouselImage = document.getElementById("carouselImage");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const downloadBtn = document.getElementById("downloadBtn");


mainBtn.onclick = async () => {
  // Prova múltiples mètodes d'autenticació
  const token = localStorage.getItem('strava_session_token');
  
  let authRes;
  if (token) {
    // Mètode 1: Token via header (funciona a Safari mòbil)
    authRes = await fetch(`${API}/me_token`, {
      headers: { "x-session-token": token }
    });
  } else {
    // Mètode 2: Cookies (per a navegadors que les suportin)
    authRes = await fetch(`${API}/me_token`, {
      credentials: "include"
    });
  }
  
  const data = await authRes.json();
  console.log("🔍 Autenticació:", data);

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
  
  const token = localStorage.getItem('strava_session_token');
  const headers = {};
  
  if (token) {
    headers["x-session-token"] = token;
  }
  
  const res = await fetch(`${API}/wrapped/image`, {
    credentials: "include",  // Encara intentem cookies si funciona
    headers: headers
  });

  const data = await res.json();

  // Guardem tant les imatges com els noms
  images = data.images;
  imageNames = data.image_names || [  // Si el backend retorna noms
    "resum_any.jpg", "km_totals.jpg", "temps_total.jpg", 
    "desnivell.jpg", "esport_dominant.jpg", "millor_activitat.jpg",
    "dades_socials.jpg", "energia.jpg", "esports_practicats.jpg"
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

