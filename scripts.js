async function loadProducts() {
  const res = await fetch("/.netlify/functions/products");
  const products = await res.json();
  const container = document.getElementById("product-list");

  container.innerHTML = products.map(p => `
    <div class="product-card">
      <div class="slider">
        ${p.images.map((img, i) => `
          <img src="${img}" alt="${p.title}" class="${i === 0 ? 'active' : ''}">
        `).join("")}
        <div class="dots">
          ${p.images.map((_, i) => `<span class="${i === 0 ? 'dot active' : 'dot'}"></span>`).join("")}
        </div>
      </div>
      <h2>${p.title}</h2>
      <p>${p.description}</p>
      <p><strong>${p.price}</strong></p>
      <a href="${p.shopier}" target="_blank">Satın Al</a>
    </div>
  `).join("");

  // Slider fonksiyonu
  document.querySelectorAll(".product-card").forEach(card => {
    const imgs = card.querySelectorAll(".slider img");
    const dots = card.querySelectorAll(".dot");
    let index = 0;

    function showImg(i) {
      imgs.forEach(img => img.classList.remove("active"));
      dots.forEach(dot => dot.classList.remove("active"));
      imgs[i].classList.add("active");
      dots[i].classList.add("active");
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        index = i;
        showImg(i);
      });
    });
  });
}

loadProducts();
