import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
    {
        name: "Cinta decorativa",
        price: "1 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512985552.jpg",
        dataAiHint: "decorative tape",
        customization: {
            type: 'text',
            label: 'Personalízala como quieras'
        }
    },
    {
        name: "Pegatina para la ropa",
        price: "2 €",
        imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512985314.jpg",
        dataAiHint: "clothing patch",
        customization: {
            type: 'text',
            label: 'Pon tu nombre'
        }
    }
];

export default function Seccion5() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-12 px-4 md:px-8 bg-background">
          <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Sección 5</h2>
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