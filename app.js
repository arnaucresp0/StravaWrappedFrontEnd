const API = "http://localhost:8000";

const mainBtn = document.getElementById("mainBtn");
const imagesDiv = document.getElementById("images");

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

async function generateWrapped() {
  mainBtn.disabled = true;
  mainBtn.innerText = "Generant el teu Wrapped...";

  const res = await fetch(`${API}/wrapped/image`, {
    credentials: "include"
  });

  const data = await res.json();

  imagesDiv.innerHTML = "";

  data.images.forEach(path => {
    const name = path.split("\\").pop();

    const img = document.createElement("img");
    img.src = `${API}/wrapped/image/${name}`;
    img.style.maxWidth = "100%";
    img.style.marginBottom = "20px";

    imagesDiv.appendChild(img);
  });

  mainBtn.style.display = "none";
}
