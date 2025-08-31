// script.js - products.json'dan ürünleri okuyup DOM'a yerleştirir
const placeholderSVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
    <rect width='100%' height='100%' fill='%23f3f4f6'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-family='Arial, sans-serif' font-size='24'>Resim yok</text>
  </svg>`
);
const placeholderDataURI = `data:image/svg+xml;utf8,${placeholderSVG}`;

function escapeHtml(str){
  if(!str) return '';
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#39;');
}

async function loadProducts(){
  try{
    const res = await fetch('/products.json?v=' + Date.now());
    const data = await res.json();
    const products = Array.isArray(data) ? data : (data.products || []);
    renderProducts(products);
  }catch(e){
    console.error('products.json yüklenirken hata:', e);
    document.getElementById('product-list').innerHTML = '<p>Ürünler yüklenemiyor.</p>';
  }
}

function renderProducts(products){
  const container = document.getElementById('product-list');
  container.innerHTML = products.map(p => {
    const title = escapeHtml(p.title || '');
    const desc = escapeHtml(p.description || '');
    const price = escapeHtml(p.price || '');
    const shopier = escapeHtml(p.shopier || '#');
    const imgs = Array.isArray(p.images) && p.images.length ? p.images : [placeholderDataURI];
    const imgsHtml = imgs.map((img, i) => {
      return `<img data-src="${img}" class="${i===0 ? 'active' : ''}" alt="${title}">`;
    }).join('');
    const dotsHtml = imgs.map((_, i) => `<span class="dot ${i===0 ? 'active' : ''}" data-index="${i}"></span>`).join('');
    return `
      <article class="product-card" data-id="${escapeHtml(p.id||'')}">
        <div class="slider">
          ${imgsHtml}
          <div class="dots">${dotsHtml}</div>
        </div>
        <div class="product-info">
          <h2>${title}</h2>
          <p>${desc}</p>
          <div class="price">${price}</div>
          <a class="buy-btn" href="${shopier}" target="_blank" rel="noopener">Satın Al</a>
        </div>
      </article>
    `;
  }).join('');

  // slider davranışı
  document.querySelectorAll('.product-card').forEach(card => {
    const imgs = Array.from(card.querySelectorAll('.slider img'));
    const dots = Array.from(card.querySelectorAll('.dot'));
    let index = 0;

    imgs.forEach(img => {
      const src = img.getAttribute('data-src') || placeholderDataURI;
      const secureSrc = src.replace(/^http:\/\//i, 'https://');
      img.src = secureSrc;
      img.addEventListener('error', () => {
        if(img.src !== placeholderDataURI) img.src = placeholderDataURI;
      });
    });

    function show(i){
      if(i < 0) i = 0;
      if(i >= imgs.length) i = imgs.length - 1;
      imgs.forEach(im => im.classList.remove('active'));
      dots.forEach(d => d.classList.remove('active'));
      imgs[i] && imgs[i].classList.add('active');
      dots[i] && dots[i].classList.add('active');
      index = i;
    }

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => show(i));
    });
  });
}

// sayfa yüklenince çalıştır
loadProducts();
