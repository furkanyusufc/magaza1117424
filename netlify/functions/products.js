export async function handler() {
  const products = [
    {
      id: "38639306",
      title: "Nişan, Söz, Gelin Çiçeği",
      description: "Krapon kağıdından el yapımı buket. Sap kısmı yapay kuş tüyü ile rahat tutuş sağlar.",
      price: "1750 TL",
      images: [
        "https://cdn.shopier.app/pictures_large/BlzALK_5dfa8087f5710a494ec0c8005cbed74e.jpg",
        "https://cdn.shopier.app/scaledoriginal/BlzALK_cefe4e1f78cb2923d58db4c8f60bd745.jpg",
      ],
      shopier: "https://shopier.com/38639306"
    },
    {
      id: "38639126",
      title: "Gelin Çiçeği",
      description: "El yapımı gelin tacı. Özel günlerde şıklığınızı tamamlar.",
      price: "750 TL",
      images: [
        "https://cdn.shopier.app/scaledoriginal/BlzALK_c23b92f2f5f2ce4a5a400da15d85308e.jpg",
        "https://cdn.shopier.app/scaledoriginal/BlzALK_768e27d6ff587531ff9fe1fd86ffb05d.jpg"
      ],
      shopier: "https://shopier.com/38639126"
    }
  ];

  return {
    statusCode: 200,
    body: JSON.stringify(products),
  };
}
