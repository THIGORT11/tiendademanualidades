import { Header, Footer, Navigation } from "@/components/layout-components";
import { ProductCard, Product } from "@/components/product-card";

const products: Product[] = [
  {
    name: "Álbum de cromos",
    price: "5 €",
    imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512860181.jpg",
    dataAiHint: "sticker album"
  },
  {
    name: "Sobre",
    price: "2 €",
    imageUrl: "https://d2j6dbq0eux0bg.cloudfront.net/images/107979772/4512860176.jpg",
    dataAiHint: "trading cards"
  },
  {
    name: "Cuaderno",
    price: "3 €",
    imageUrl: "https://i.imgur.com/nHzHIpK.jpeg",
    dataAiHint: "notebook"
  },
];

export default function Seccion1() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <section className="py-12 px-4 text-center bg-background">
          <Navigation />
        </section>
        <section className="py-12 px-4 md:px-8 bg-background">
          <h2 className="text-4xl font-bold text-primary mb-12 font-headline text-center">Sección 1</h2>
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