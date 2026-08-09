import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
    {
        name: "Joyas",
        price: "3 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512965666.jpg",
        dataAiHint: "jewelry beads",
        customization: {
            type: 'radio',
            label: 'Elige tu tipo de joya',
            options: ['Anillos', 'Collares', 'Pulseras']
        }
    },
    {
        name: "Dibujo",
        price: "1 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512965671.jpg",
        dataAiHint: "coloring page",
        customization: {
            type: 'text',
            label: 'Personalízalo como quieras'
        }
    },
    {
        name: "Aquabeads a elegir",
        price: "10 €",
        imageUrl: "https://i.imgur.com/D8R6gVC.jpeg",
        imageUrls: [
            "https://i.imgur.com/D8R6gVC.jpeg",
            "https://i.imgur.com/FFBmVQh.jpeg"
        ],
        dataAiHint: "aquabeads designs",
        description: "Elige uno de los ocho diseños disponibles en las dos imágenes.",
        customization: {
            type: 'number',
            label: 'Número del diseño que quieres',
            min: 1,
            max: 8,
            helpText: 'La selección es obligatoria para añadir este producto al carrito.'
        }
    }
];

export default function Seccion4() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-12 px-4 md:px-8 bg-card">
          <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Sección 4</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.name} product={product} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
