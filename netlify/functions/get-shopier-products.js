// netlify/functions/get-shopier-products.js
export async function handler(event, context) {
  // ENV değişkenleri (Netlify site settings -> Build & deploy -> Environment)
  const SHOPIER_API_KEY = process.env.SHOPIER_API_KEY; // zorunlu
  const SHOPIER_SHOP_ID = process.env.SHOPIER_SHOP_ID || ''; // isteğe bağlı
  // Gerçek Shopier ürün endpoint'ini buraya koy. Aşağıdaki örnek bir şablondur.
  // (Lütfen Shopier panelindeki API docs'tan gerçek endpoint'i alıp değiştir.)
  const SHOPIER_ENDPOINT = process.env.SHOPIER_ENDPOINT || `https://api.shopier.com/v1/shops/${SHOPIER_SHOP_ID}/products`;

  if (!SHOPIER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'SHOPIER_API_KEY environment variable not set' })
    };
  }

  try {
    const res = await fetch(SHOPIER_ENDPOINT, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${SHOPIER_API_KEY}`,
        'Accept': 'application/json'
        // Eğer Shopier farklı header istiyorsa (ör. 'X-API-KEY'), burayı değiştirin.
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return { statusCode: res.status, body: JSON.stringify({ error: 'Shopier API error', detail: text }) };
    }

    const data = await res.json();

    // Map: Shopier'in döndürdüğü yapıya göre aşağıyı uyarlaman gerekebilir.
    // Ama genel amaç: frontend'imizin beklediği dizi formatı => [{id,title,description,price,image,shopier},...]
    // ÖNEMLİ: data yapısını console.log ile kontrol edip map kısmını ona göre düzenle.
    const items = (data.products || data.items || data || []).map(p => ({
      id: p.id || p.product_id || String(p.sku || ''),
      title: p.title || p.name || p.product_name || '',
      description: p.description || p.summary || '',
      price: (p.price || p.amount || '') + (p.currency ? ` ${p.currency}` : ''),
      image: p.image_url || (p.images && p.images[0]) || '',
      // shopier link: eğer API veriyorsa p.url kullan, yoksa tahmini link:
      shopier: p.url || `https://shopier.com/${p.id || p.product_id || ''}`
    }));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Exception', message: err.message })
    };
  }
}
